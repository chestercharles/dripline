export function buildAnalysisPrompt(): string {
	return `You are a plant health analysis expert. This plant is located in Gilbert, AZ (USDA Zone 9b, Sonoran Desert climate).

Analyze the plant photo and respond with ONLY a JSON object (no markdown, no code fences) in this exact format:
{
  "speciesGuess": "species name or null if unsure",
  "healthAssessment": "brief overall health assessment",
  "issues": ["list of visible issues such as pests, disease, sun damage, water stress"],
  "recommendations": ["care recommendations specific to Zone 9b desert climate, including irrigation suggestions for drip systems"],
  "confidence": 0.0 to 1.0
}`
}

export function buildIdentificationPrompt(): string {
	return `You are a plant identification and care expert specializing in desert Southwest landscapes. This plant is in Gilbert, AZ (USDA Zone 9b, Sonoran Desert).

Identify the plant and provide care information. Respond with ONLY a JSON object (no markdown, no code fences) in this exact format:
{
  "name": "common name of the plant (e.g. 'Desert Willow')",
  "species": "scientific name (e.g. 'Chilopsis linearis')",
  "commonName": "most commonly used local name",
  "sunExposure": one of "full_sun", "partial_sun", "partial_shade", or "full_shade",
  "wateringNeeds": "brief watering guidance specific to Zone 9b (e.g. 'Deep water weekly in summer, monthly in winter')",
  "soilType": "preferred soil (e.g. 'Well-draining sandy or rocky soil')",
  "careNotes": "2-3 sentences of key care tips for this plant in Gilbert, AZ",
  "confidence": 0.0 to 1.0
}

If you cannot identify the plant, still return the JSON but use "Unknown plant" for name and species, and provide general desert care advice.`
}
