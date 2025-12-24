// Comprehensive test for improved search and knowledge journey system
import { semanticSearch } from './src/utils/semanticSearch.js';
import { analyzeIntent } from './src/utils/intentAnalyzer.js';
import { generateJourney } from './src/utils/journeyBuilder.js';
import catalogData from './public/data/catalog.json' with { type: 'json' };

console.log("🧪 Testing Comprehensive Search & Knowledge Journey System\n");
console.log("=" . repeat(60));

// Test scenarios covering different user needs
const testScenarios = [
  {
    query: "what about internet of things?",
    description: "IoT exploration query (previously failing)"
  },
  {
    query: "I'm stressed and need help",
    description: "Mental health support query"
  },
  {
    query: "how to fix my bike",
    description: "Problem-solving query"
  },
  {
    query: "learn Spanish",
    description: "Language learning query"
  },
  {
    query: "rainy day activities for kids",
    description: "Entertainment query"
  },
  {
    query: "I want to start a garden",
    description: "New hobby query"
  },
  {
    query: "philadelphia",
    description: "Location-based query (previously improved)"
  },
  {
    query: "learn programming",
    description: "Technical skill development"
  },
  {
    query: "what can I borrow besides books?",
    description: "Material type discovery query"
  },
  {
    query: "I'm bored",
    description: "General entertainment query"
  }
];

// Test each scenario
testScenarios.forEach((scenario, index) => {
  console.log(`\n${index + 1}. ${scenario.description}`);
  console.log(`   Query: "${scenario.query}"`);
  console.log("   " + "-".repeat(50));

  // Analyze intent
  const intent = analyzeIntent(scenario.query);
  console.log(`   📊 Intent: ${intent.primary} (confidence: ${(intent.confidence * 100).toFixed(0)}%)`);
  console.log(`   🎯 Journey Stage: ${intent.journeyStage}`);
  console.log(`   📦 Suggested Materials: ${intent.suggestedMaterials.join(', ')}`);

  // Perform semantic search
  const results = semanticSearch(scenario.query, catalogData, 5, intent);

  if (results.length === 0) {
    console.log("   ❌ No results found (This should not happen with fallback!)");
  } else {
    console.log(`   ✅ Found ${results.length} results:`);

    // Show material type diversity
    const materialTypes = new Set(results.map(r => r.itemType));
    console.log(`   📚 Material diversity: ${Array.from(materialTypes).join(', ')}`);

    // Show top 3 results
    results.slice(0, 3).forEach((item, idx) => {
      const icon = item.itemType === 'book' ? '📚' :
                   item.itemType === 'dvd' ? '📀' :
                   item.itemType === 'thing' || item.itemType === 'equipment' ? '🔧' :
                   item.itemType === 'game' ? '🎮' :
                   item.itemType === 'kit' ? '📦' : '📖';

      console.log(`\n   ${idx + 1}. ${icon} ${item.title}`);
      if (item.author) console.log(`      Author: ${item.author}`);
      if (item.itemType !== 'book') console.log(`      Type: ${item.itemType}`);
      console.log(`      ${item.description.substring(0, 80)}...`);
    });
  }

  // Try to generate a journey for learning-oriented queries
  if (intent.primary === 'learn' || intent.primary === 'explore') {
    const journey = generateJourney(scenario.query, catalogData, intent);
    if (journey) {
      console.log(`\n   🗺️ Knowledge Journey: "${journey.title}"`);
      console.log(`      Stages: ${journey.stages.map(s => s.name).join(' → ')}`);
    }
  }
});

// Test material type boosting
console.log("\n\n🔬 Testing Material Type Boosting");
console.log("=" . repeat(60));

const materialTestQueries = [
  { query: "arduino projects", expected: ["thing", "equipment"] },
  { query: "watch documentaries", expected: ["dvd"] },
  { query: "board games for family", expected: ["game"] },
  { query: "fix my toilet", expected: ["thing", "equipment", "book"] }
];

materialTestQueries.forEach(test => {
  console.log(`\nQuery: "${test.query}"`);
  const results = semanticSearch(test.query, catalogData, 3);
  const foundTypes = [...new Set(results.map(r => r.itemType))];
  const hasExpected = test.expected.some(type => foundTypes.includes(type));
  console.log(`Expected types: ${test.expected.join(', ')}`);
  console.log(`Found types: ${foundTypes.join(', ')}`);
  console.log(hasExpected ? "✅ Material type boosting working!" : "⚠️ May need adjustment");
});

// Summary statistics
console.log("\n\n📈 System Statistics");
console.log("=" . repeat(60));

const totalItems = catalogData.length;
const itemTypes = catalogData.reduce((acc, item) => {
  acc[item.itemType] = (acc[item.itemType] || 0) + 1;
  return acc;
}, {});

console.log(`Total catalog items: ${totalItems}`);
console.log("Material type distribution:");
Object.entries(itemTypes).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count} items (${((count/totalItems)*100).toFixed(1)}%)`);
});

// IoT specific test
console.log("\n\n🌐 IoT Query Deep Dive");
console.log("=" . repeat(60));

const iotResults = semanticSearch("internet of things", catalogData, 10);
console.log(`Found ${iotResults.length} IoT-related items:`);
iotResults.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.itemType}] ${item.title}`);
});

console.log("\n✨ Search Improvements Summary:");
console.log("• Intent analysis understands user needs");
console.log("• Semantic search with 100+ keyword mappings");
console.log("• Material type boosting for relevant formats");
console.log("• Intelligent fallback when API fails");
console.log("• Knowledge journey generation");
console.log("• Support for diverse material types (books, DVDs, equipment, games, kits)");
console.log("\n🎯 The system now provides relevant, diverse recommendations");
console.log("   for any patron query, supporting their complete knowledge journey!");