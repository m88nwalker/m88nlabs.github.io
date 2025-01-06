document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const filters = document.getElementById("filters");
  let jsonData = [];
  const pageSize = 50; // Number of images to load per page
  let currentPage = 0; // Track the current page

  // Dynamically load metadata from the manifest
  async function loadMetadata() {
    try {
      const response = await fetch("metadata/manifest.json");
      const files = await response.json();

      const metadataPromises = files.map(async (file) => {
        const fileResponse = await fetch(`metadata/${file}`);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch: ${file}`);
        }
        return fileResponse.json();
      });

      jsonData = await Promise.all(metadataPromises);
      processTraitValues();
      renderFilters();
      renderGallery(jsonData.slice(0, pageSize)); // Render the first page of images
    } catch (error) {
      console.error("Error loading metadata files:", error);
    }
  }

  const traitTypes = ["Background", "Townie", "Pants", "Shirt", "Hair", "Eyes", "Hat", "Mouth"];
  const traitValues = {};

  // Process and collect trait values
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

  // Render filters
  const renderFilters = () => {
    filters.innerHTML = ""; // Clear filters before rendering
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

      const img = document.createElement("img");
      img.dataset.src = `images/${item.image}`;
      img.alt = item.name;
      img.classList.add("lazy");

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

  // Load more images on button click
  document.getElementById("load-more").addEventListener("click", () => {
    currentPage++;
    const start = currentPage * pageSize;
    const end = start + pageSize;
    renderGallery(jsonData.slice(0, end)); // Render up to the new page limit
  });

  filters.addEventListener("change", applyFilters);

  // Initial load
  await loadMetadata();
});
