const fs = require("fs");
const path = require("path");

// Paths to metadata and trait counts
const metadataFolder = path.join(__dirname, "metadata");
const traitCountsFile = path.join(metadataFolder, "trait_counts.json");
const rarityOutputFile = path.join(metadataFolder, "rarity.json");

// Load trait counts
const loadTraitCounts = () => {
  if (!fs.existsSync(traitCountsFile)) {
    throw new Error("trait_counts.json not found!");
  }
  return JSON.parse(fs.readFileSync(traitCountsFile, "utf-8"));
};

// Load metadata files
const loadMetadata = () => {
  const subFolders = fs.readdirSync(metadataFolder).filter((folder) =>
    fs.lstatSync(path.join(metadataFolder, folder)).isDirectory()
  );

  const metadata = [];
  subFolders.forEach((subFolder) => {
    const files = fs
      .readdirSync(path.join(metadataFolder, subFolder))
      .filter((file) => file.endsWith(".json"));

    files.forEach((file) => {
      const filePath = path.join(metadataFolder, subFolder, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      metadata.push(data);
    });
  });

  return metadata;
};

// Calculate rarity
const calculateRarity = (metadata, traitCounts) => {
  return metadata.map((nft) => {
    let rarityScore = 0;

    nft.attributes.forEach((attribute) => {
      const traitType = attribute.trait_type;
      const value = attribute.value;

      if (traitCounts[traitType] && traitCounts[traitType][value] !== undefined) {
        const count = traitCounts[traitType][value];
        const rarityPercentage = count / metadata.length;
        const rarityValue = 1 / rarityPercentage;
        rarityScore += rarityValue;
      } else {
        console.warn(`Missing count for ${traitType}: ${value}`);
      }
    });

    return { tokenId: nft.tokenId, rarityScore };
  });
};

// Rank NFTs by rarity score
const rankNFTs = (rarityData) => {
  rarityData.sort((a, b) => b.rarityScore - a.rarityScore);
  return rarityData.map((nft, index) => ({
    ...nft,
    rank: index + 1,
  }));
};

// Main execution
try {
  const traitCounts = loadTraitCounts();
  const metadata = loadMetadata();
  const rarityData = calculateRarity(metadata, traitCounts);
  const rankedNFTs = rankNFTs(rarityData);

  fs.writeFileSync(rarityOutputFile, JSON.stringify(rankedNFTs, null, 2));
  console.log("Rarity ranking completed! Output saved to rarity.json");
} catch (error) {
  console.error("Error:", error.message);
}
