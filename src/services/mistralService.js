const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function explainDisruption(disruptionData) {
  try {
    const prompt = `You are an expert supply chain analyst explaining complex supply chain disruptions to non-technical stakeholders. 

Please explain this supply chain disruption in simple, clear terms that a business executive or policy maker could understand:

Disruption Type: ${disruptionData.type}
Material Volume Affected: ${disruptionData.affectedVolume} tons
Economic Impact: ${disruptionData.economicImpact}
Capacity Reduction: ${disruptionData.capacityReduction}
Time to Resolve: ${disruptionData.timeToResolve}
Alternative Route: ${disruptionData.alternativeRoute}
Affected Facilities: ${disruptionData.affectedFacilities?.join(', ')}

Please provide a concise explanation in exactly 3 short paragraphs:

1. **Business Impact**: What this disruption means in simple business terms
2. **Strategic Risk**: Why this threatens EU supply chain security  
3. **Immediate Actions**: What decision-makers should do now

Use simple language, avoid technical jargon, and keep each paragraph to 2-3 sentences maximum.`;

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    throw new Error('Failed to generate explanation. Please try again.');
  }
}