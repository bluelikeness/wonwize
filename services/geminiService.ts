
export const fetchMarketData = async () => {
  try {
    // 1. 오늘 날짜와 어제 날짜 구하기
    const today = new Date();
    // 주말(토=6, 일=0)인 경우 금요일 데이터로 fallback하기 위해 날짜 조정이 필요할 수 있으나
    // Frankfurter API는 휴일 요청 시 404를 줄 수 있으므로, 안전하게 데이터를 가져오는 로직이 필요.
    // 여기서는 간단히 어제 날짜를 구하고, API 호출 실패 시 처리를 담당.
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const yesterdayStr = formatDate(yesterday);

    // 2. 병렬로 API 호출 (EUR 기준)
    // Frankfurter API는 무료이며 CORS를 지원합니다.
    // 'from' 파라미터에 여러 통화를 넣을 수 없으므로, 기본값(EUR) 기준으로 USD, JPY, KRW를 모두 가져와서 계산합니다.
    // URL: https://api.frankfurter.app/latest?to=USD,JPY,KRW
    
    const [currentRes, pastRes] = await Promise.all([
      fetch('https://api.frankfurter.app/latest?to=USD,JPY,KRW'),
      fetch(`https://api.frankfurter.app/${yesterdayStr}?to=USD,JPY,KRW`)
    ]);

    if (!currentRes.ok) {
        throw new Error(`Failed to fetch current rates: ${currentRes.status}`);
    }
    
    const currentData = await currentRes.json();
    
    // 어제 데이터가 없으면(휴일, 404 등) 현재 데이터로 대체
    let pastData = currentData;
    if (pastRes.ok) {
        pastData = await pastRes.json();
    }

    // 3. 데이터 가공 (Cross Rate Calculation)
    // 1 EUR = x USD
    // 1 EUR = y KRW
    // -> 1 USD = y / x KRW
    
    const calculateRates = (data: any) => {
        const rates = data.rates;
        // rates가 없는 경우 방어 코드
        if (!rates || !rates.USD || !rates.KRW || !rates.JPY) {
            return { usd: 0, jpy: 0 };
        }
        
        const usdToKrw = rates.KRW / rates.USD;
        const jpyToKrw = (rates.KRW / rates.JPY) * 100; // 100엔 기준
        
        return { usd: usdToKrw, jpy: jpyToKrw };
    };

    const currentRates = calculateRates(currentData);
    const pastRates = calculateRates(pastData);

    // 값이 0이면 에러 처리
    if (currentRates.usd === 0) throw new Error('Invalid rate data');

    // 변동폭 계산
    const usdChange = currentRates.usd - pastRates.usd;
    const usdPercent = pastRates.usd !== 0 ? (usdChange / pastRates.usd) * 100 : 0;
    
    const jpyChange = currentRates.jpy - pastRates.jpy;
    const jpyPercent = pastRates.jpy !== 0 ? (jpyChange / pastRates.jpy) * 100 : 0;

    // 4. 간단한 인사이트 생성
    let insight = "";
    if (usdChange > 0 && jpyChange > 0) {
      insight = "달러와 엔화가 모두 전일 대비 강세입니다. 원화 가치가 상대적으로 하락하고 있습니다.";
    } else if (usdChange < 0 && jpyChange < 0) {
      insight = "달러와 엔화 모두 하락세입니다. 원화 가치가 회복되고 있는 추세입니다.";
    } else if (usdChange > 0) {
      insight = `달러는 오르고(+${usdPercent.toFixed(2)}%), 엔화는 떨어지는(-${Math.abs(jpyPercent).toFixed(2)}%) 혼조세입니다.`;
    } else {
      insight = `달러는 내리고(-${Math.abs(usdPercent).toFixed(2)}%), 엔화는 오르는(+${jpyPercent.toFixed(2)}%) 흐름입니다.`;
    }

    // 어제 날짜 데이터가 API에서 없는 경우(주말 등), 0% 변동으로 나올 수 있으므로 안내 추가
    if (usdChange === 0 && jpyChange === 0) {
        insight = "현재 외환 시장 휴장일이거나 전일 데이터와 동일하여 변동이 없습니다.";
    }

    return {
      rates: {
        usd: { value: currentRates.usd, change: usdChange, percent: usdPercent },
        jpy: { value: currentRates.jpy, change: jpyChange, percent: jpyPercent }
      },
      insight: insight,
      sources: [{ title: 'Frankfurter API', uri: 'https://www.frankfurter.app' }]
    };

  } catch (error) {
    console.error("Error fetching market data:", error);
    // 에러 발생 시 fallback 데이터 (보여줄게 없을 때)
    return {
      rates: {
        usd: { value: 1400.00, change: 0, percent: 0 },
        jpy: { value: 920.00, change: 0, percent: 0 }
      },
      insight: "환율 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      sources: []
    };
  }
};
