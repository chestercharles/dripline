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
	return `You are a plant identification and care expert specializing in desert Southwest landscapes, particularly Gilbert, AZ (USDA Zone 9b, Sonoran Desert).

Identify the plant in the photo and provide comprehensive care information tailored to the Sonoran Desert climate. Respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) matching this exact schema:

{
  "name": "common name (e.g. 'Desert Willow')",
  "species": "scientific/Latin name (e.g. 'Chilopsis linearis')",
  "confidence": 0.0 to 1.0,
  "sunExposure": "full_sun" | "partial_sun" | "partial_shade" | "full_shade",
  "wateringFrequency": "watering schedule for Gilbert AZ (e.g. 'Weekly in summer, every 2-3 weeks in winter')",
  "wateringDepth": "how deep to water (e.g. 'Deep water to 18 inches')",
  "droughtTolerance": "high" | "medium" | "low",
  "heatTolerance": "high" | "medium" | "low",
  "matureHeight": "e.g. '15-25 ft'",
  "matureWidth": "e.g. '10-15 ft'",
  "growthRate": "fast" | "moderate" | "slow",
  "soilType": "preferred soil type (e.g. 'Well-draining sandy or rocky soil')",
  "bloomSeason": "bloom period or null if non-blooming (e.g. 'Spring through fall')",
  "bloomColor": "flower color or null if non-blooming (e.g. 'Purple-pink')",
  "nativeToSonoran": true or false,
  "wildlifeValue": "wildlife it attracts (e.g. 'Attracts hummingbirds and butterflies')",
  "toxicity": "toxicity info (e.g. 'Non-toxic' or 'Mildly toxic to pets')",
  "commonProblems": ["problem 1", "problem 2"],
  "bestPlantingTime": "best time to plant in Zone 9b (e.g. 'Fall or early spring')",
  "fertilizing": "fertilizer recommendations (e.g. 'Light fertilizer in spring only')",
  "careNotes": "2-3 sentence summary of the most important care tips for this plant in Gilbert, AZ Zone 9b"
}

Important:
- All advice must be specific to the extreme heat and arid conditions of Gilbert, AZ (Zone 9b)
- wateringFrequency should account for seasonal variation (summer vs winter)
- If you cannot confidently identify the plant, use "Unknown plant" for name and species, set confidence below 0.3, and provide general desert landscaping care advice
- bloomSeason and bloomColor should be null (not the string "null") for non-blooming plants
- commonProblems should list 2-4 issues relevant to this plant in the Sonoran Desert`
}
