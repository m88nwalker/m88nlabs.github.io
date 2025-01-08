document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const filters = document.getElementById("filters");
  let jsonData = [];
  const pageSize = 50;
  let currentPage = 0;
  let manifestFiles = [];
  let traitCounts = {};
  let rarityData = [];

  const getImageFolder = (id) => {
    const tokenId = parseInt(id);
    if (tokenId <= 500) return "1-500";
    if (tokenId <= 1000) return "501-1000";
    if (tokenId <= 1500) return "1001-1500";
    if (tokenId <= 2000) return "1501-2000";
    return "2001-2222";
  };

  async function loadManifest() {
    try {
      const response = await fetch("metadata/manifest.json");
      manifestFiles = await response.json();
    } catch (error) {
      console.error("Error loading manifest file:", error);
    }
  }

  async function loadTraitCounts() {
    try {
      const response = await fetch("metadata/trait_counts.json");
      traitCounts = await response.json();
    } catch (error) {
      console.error("Error loading trait counts:", error);
    }
  }

  async function loadRarityData() {
    try {
      const response = await fetch("metadata/rarity.json");
      rarityData = await response.json();
    } catch (error) {
      console.error("Error loading rarity data:", error);
    }
  }

  async function loadMetadataChunk() {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    const chunk = manifestFiles.slice(start, end);

    try {
      const metadataPromises = chunk.map(async (file) => {
        const fileResponse = await fetch(`metadata/${file}`);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch: ${file}`);
        }
        return fileResponse.json();
      });

      const chunkData = await Promise.all(metadataPromises);
      jsonData = [...jsonData, ...chunkData];
    } catch (error) {
      console.error("Error loading metadata files:", error);
    }
  }

  const mergeRarityData = () => {
    const rarityMap = new Map(rarityData.map((item) => [item.tokenId, item]));
    jsonData = jsonData.map((item) => ({
      ...item,
      rarityScore: rarityMap.get(item.tokenId)?.rarityScore || 0,
      rank: rarityMap.get(item.tokenId)?.rank || 0,
    }));
  };

  const renderFilters = () => {
    filters.innerHTML = "";
    Object.keys(traitCounts).forEach((trait) => {
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion-item";

      const header = document.createElement("div");
      header.className = "accordion-header";
      header.textContent = trait;
      header.addEventListener("click", () => {
        const body = header.nextElementSibling;
        body.classList.toggle("open");
      });

      const body = document.createElement("div");
      body.className = "accordion-body";

      Object.entries(traitCounts[trait]).forEach(([value, count]) => {
        const label = document.createElement("label");
        label.className = "filter-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.dataset.traitType = trait;

        const countElement = document.createElement("span");
        countElement.className = "filter-count";
        countElement.textContent = count;

        const valueText = document.createElement("span");
        valueText.className = "filter-value";
        valueText.textContent = value;

        label.appendChild(valueText);
        label.appendChild(countElement);
        label.appendChild(checkbox);
        body.appendChild(label);
      });

      accordionItem.appendChild(header);
      accordionItem.appendChild(body);
      filters.appendChild(accordionItem);
    });
  };

  const renderGallery = (data) => {
    gallery.innerHTML = "";
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const folder = getImageFolder(item.image.split(".")[0]);
      const img = document.createElement("img");
      img.dataset.src = `images/${folder}/${item.image}`;
      img.alt = item.name;
      img.classList.add("lazy");

      img.onerror = () => {
        img.src = "images/0.png";
      };

      const observer = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.onload = () => lazyImage.classList.remove("lazy");
            observer.unobserve(lazyImage);
          }
        },
        { rootMargin: "0px 0px 50px 0px" }
      );

      observer.observe(img);
      card.appendChild(img);

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = item.name;
      card.appendChild(name);

      const rank = document.createElement("div");
      rank.className = "rank";
      rank.textContent = `Rank: #${item.rank}`;
      card.appendChild(rank);

      const score = document.createElement("div");
      score.className = "score";
      score.textContent = `Rarity Score: ${item.rarityScore.toFixed(2)}`;
      card.appendChild(score);

      const attributes = document.createElement("div");
      attributes.className = "attributes";

      item.attributes.forEach((attr) => {
        const attrBox = document.createElement("div");
        attrBox.className = "attribute";
        attrBox.textContent = `${attr.trait_type}: ${attr.value}`;
        attributes.appendChild(attrBox);
      });

      card.appendChild(attributes);
      gallery.appendChild(card);
    });
  };

  const sortGallery = (sortOption) => {
    let sortedData = [...jsonData];

    if (sortOption === "rank") {
      sortedData.sort((a, b) => a.rank - b.rank);
    } else if (sortOption === "score") {
      sortedData.sort((a, b) => b.rarityScore - a.rarityScore);
    }

    renderGallery(sortedData.slice(0, pageSize * (currentPage + 1)));
  };

  document.getElementById("sort-options").addEventListener("change", (event) => {
    const sortOption = event.target.value;
    sortGallery(sortOption);
  });

  document.getElementById("load-more").addEventListener("click", async () => {
    currentPage++;
    await loadMetadataChunk();
    mergeRarityData();
    renderGallery(jsonData.slice(0, pageSize * (currentPage + 1)));
  });

  filters.addEventListener("change", () => {
    const selectedFilters = {};
    document.querySelectorAll(".accordion-body input:checked").forEach((checkbox) => {
      const traitType = checkbox.dataset.traitType;
      if (!selectedFilters[traitType]) {
        selectedFilters[traitType] = new Set();
      }
      selectedFilters[traitType].add(checkbox.value);
    });

    const filteredData = jsonData.filter((item) =>
      item.attributes.every((attr) => {
        if (!selectedFilters[attr.trait_type] || selectedFilters[attr.trait_type].size === 0) {
          return true;
        }
        return selectedFilters[attr.trait_type].has(attr.value);
      })
    );

    renderGallery(filteredData.slice(0, pageSize * (currentPage + 1)));
  });

  await loadManifest();
  await loadTraitCounts();
  await loadRarityData();
  await loadMetadataChunk();
  mergeRarityData();
  renderFilters();
  renderGallery(jsonData.slice(0, pageSize));
});
