
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchMarketData = async () => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    오늘의 USD/KRW(원/달러) 및 JPY/KRW(원/엔, 100엔 기준) 실시간 환율을 찾아주세요.
    또한 현재 한국 원화의 시장 트렌드에 대한 짧은 요약을 '한국어'로 제공해주세요.
    결과는 반드시 다음 JSON 형식으로만 반환하세요:
    {
      "rates": {
        "usd": { "value": number, "change": number, "percent": number },
        "jpy": { "value": number, "change": number, "percent": number }
      },
      "insight": "한국어로 된 짧은 시장 요약"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const data = JSON.parse(response.text || '{}');
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || '출처',
        uri: chunk.web?.uri || '#'
      }))
      .filter((s: any) => s.uri !== '#') || [];

    return {
      rates: data.rates,
      insight: data.insight,
      sources
    };
  } catch (error) {
    console.error("Error fetching market data:", error);
    return {
      rates: {
        usd: { value: 1385.50, change: 2.5, percent: 0.18 },
        jpy: { value: 912.40, change: -1.2, percent: -0.13 }
      },
      insight: "현재 데이터 연결이 원활하지 않습니다. 기본 환율 정보를 표시합니다.",
      sources: []
    };
  }
};
