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
