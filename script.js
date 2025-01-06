document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const filters = document.getElementById("filters");
  let jsonData = [];

  // Dynamically load JSON files from the 'metadata' folder
  async function loadMetadata() {
    try {
      const response = await fetch("metadata/manifest.json"); // Manifest file listing all JSON filenames
      const files = await response.json();

      const metadataPromises = files.map(async (file) => {
        const fileResponse = await fetch(`metadata/${file}`);
        return fileResponse.json();
      });

      jsonData = await Promise.all(metadataPromises);
    } catch (error) {
      console.error("Error loading metadata files:", error);
    }
  }

  const traitTypes = ["Background", "Townie", "Pants", "Shirt", "Hair", "Eyes", "Hat", "Mouth"];
  const traitValues = {};

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

  const renderFilters = () => {
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
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.dataset.traitType = trait;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(value));
        body.appendChild(label);
      });

      accordionItem.appendChild(header);
      accordionItem.appendChild(body);
      filters.appendChild(accordionItem);
    });
  };

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

    renderGallery(filteredData);
  };

  const renderGallery = (data) => {
    gallery.innerHTML = "";
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
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

  await loadMetadata();
  processTraitValues();
  renderFilters();
  renderGallery(jsonData);

  filters.addEventListener("change", applyFilters);
});