document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const filters = document.getElementById("filters");
  let jsonData = [];
  const pageSize = 50; // Number of images to load per page
  let currentPage = 0;
  let manifestFiles = [];

  // Helper function to determine the folder for an image
  const getImageFolder = (id) => {
    const tokenId = parseInt(id);
    if (tokenId <= 500) return "1-500";
    if (tokenId <= 1000) return "501-1000";
    if (tokenId <= 1500) return "1001-1500";
    if (tokenId <= 2000) return "1501-2000";
    return "2001-2222";
  };

  // Load manifest file
  async function loadManifest() {
    try {
      const response = await fetch("metadata/manifest.json");
      manifestFiles = await response.json();
    } catch (error) {
      console.error("Error loading manifest file:", error);
    }
  }

  // Load metadata for the current page
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

  const traitTypes = ["Background", "Townie", "Pants", "Shirt", "Hair", "Eyes", "Hat", "Mouth"];
  const traitValues = {};

  // Collect and count trait values
  const processTraitValues = () => {
    jsonData.forEach((item) => {
      item.attributes.forEach((attr) => {
        if (!traitValues[attr.trait_type]) {
          traitValues[attr.trait_type] = new Set();
        }
        traitValues[attr.trait_type].add(attr.value);
      });
    });
  };

  // Render filters with total counts
  const renderFilters = async () => {
    filters.innerHTML = ""; // Clear filters before rendering

    const traitCounts = {};

    // Load counts for all trait values from all metadata files
    try {
      const metadataPromises = manifestFiles.map(async (file) => {
        const fileResponse = await fetch(`metadata/${file}`);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch: ${file}`);
        }
        return fileResponse.json();
      });

      const allMetadata = await Promise.all(metadataPromises);

      allMetadata.forEach((item) => {
        item.attributes.forEach((attr) => {
          if (!traitCounts[attr.trait_type]) {
            traitCounts[attr.trait_type] = {};
          }
          traitCounts[attr.trait_type][attr.value] = (traitCounts[attr.trait_type][attr.value] || 0) + 1;
        });
      });
    } catch (error) {
      console.error("Error calculating total trait counts:", error);
    }

    // Render filters with total counts
    traitTypes.forEach((trait) => {
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

      Array.from(traitValues[trait]).forEach((value) => {
        const label = document.createElement("label");
        label.className = "filter-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.dataset.traitType = trait;

        const count = document.createElement("span");
        count.className = "filter-count";
        count.textContent = traitCounts[trait]?.[value] || 0;

        const valueText = document.createElement("span");
        valueText.className = "filter-value";
        valueText.textContent = value;

        label.appendChild(valueText);
        label.appendChild(count);
        label.appendChild(checkbox);
        body.appendChild(label);
      });

      accordionItem.appendChild(header);
      accordionItem.appendChild(body);
      filters.appendChild(accordionItem);
    });
  };

  // Apply filters
  const applyFilters = () => {
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

    renderGallery(filteredData.slice(0, pageSize * (currentPage + 1))); // Render filtered data up to the current page
  };

  // Render gallery with lazy-loaded images
  const renderGallery = (data) => {
    gallery.innerHTML = ""; // Clear gallery before rendering
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const folder = getImageFolder(item.image.split(".")[0]);
      const img = document.createElement("img");
      img.dataset.src = `images/${folder}/${item.image}`;
      img.alt = item.name;
      img.classList.add("lazy");

      // Fallback to placeholder if image fails to load
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

  // Load the next chunk of metadata when "Load More" is clicked
  document.getElementById("load-more").addEventListener("click", async () => {
    currentPage++;
    await loadMetadataChunk();
    processTraitValues();
    renderFilters();
    renderGallery(jsonData.slice(0, pageSize * (currentPage + 1)));
  });

  filters.addEventListener("change", applyFilters);

  // Initial load
  await loadManifest();
  await loadMetadataChunk();
  processTraitValues();
  await renderFilters(); // Ensure filters include all metadata counts
  renderGallery(jsonData.slice(0, pageSize));
});
