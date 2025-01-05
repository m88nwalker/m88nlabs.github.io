document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const filters = document.getElementById("filters");

  const jsonData = [
    {
      tokenId: 1,
      name: "Townie #1",
      image: "images/1.png",
      attributes: [
        { trait_type: "Background", value: "Purple" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Work Pants" },
        { trait_type: "Shirt", value: "Smoking Jacket" },
        { trait_type: "Hair", value: "Short Brown" },
        { trait_type: "Eyes", value: "Fairly Normal" },
        { trait_type: "Hat", value: "Seaman" },
        { trait_type: "Mouth", value: "Gold Grill" }
      ]
    },
    {
      tokenId: 2,
      name: "Townie #2",
      image: "images/2.png",
      attributes: [
        { trait_type: "Background", value: "Turquoise" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Blue Jeans" },
        { trait_type: "Shirt", value: "Hawaiian Green" },
        { trait_type: "Hair", value: "Short Black" },
        { trait_type: "Eyes", value: "Holographic" },
        { trait_type: "Hat", value: "Flipped Brim Black" },
        { trait_type: "Mouth", value: "O Face" }
      ]
    },
    {
      tokenId: 3,
      name: "Townie #3",
      image: "images/3.png",
      attributes: [
        { trait_type: "Background", value: "Pink" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Khaki Pants" },
        { trait_type: "Shirt", value: "T-Shirt Red" },
        { trait_type: "Hair", value: "Long Brown" },
        { trait_type: "Eyes", value: "Skeptical" },
        { trait_type: "Hat", value: "Sushi Chef" },
        { trait_type: "Mouth", value: "O Face" }
      ]
    },
    {
      tokenId: 4,
      name: "Townie #4",
      image: "images/4.png",
      attributes: [
        { trait_type: "Background", value: "Yellow" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Beach Pants" },
        { trait_type: "Shirt", value: "Smoking Jacket" },
        { trait_type: "Hair", value: "Short Blonde" },
        { trait_type: "Eyes", value: "Scumbag" },
        { trait_type: "Hat", value: "Captain's Hat" },
        { trait_type: "Mouth", value: "Kazoo" }
      ]
    },
    {
      tokenId: 5,
      name: "Townie #5",
      image: "images/5.png",
      attributes: [
        { trait_type: "Background", value: "Turquoise" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Blue Jeans" },
        { trait_type: "Shirt", value: "Hawaiian Pink" },
        { trait_type: "Hair", value: "Long Blonde" },
        { trait_type: "Eyes", value: "Eye Patch" },
        { trait_type: "Hat", value: "Captain's Hat" },
        { trait_type: "Mouth", value: "Yikes" }
      ]
    },
    {
      tokenId: 6,
      name: "Townie #6",
      image: "images/6.png",
      attributes: [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Cargo Pants" },
        { trait_type: "Shirt", value: "Tank Top" },
        { trait_type: "Hair", value: "Short Blonde" },
        { trait_type: "Eyes", value: "Sharp" },
        { trait_type: "Hat", value: "Baseball Cap" },
        { trait_type: "Mouth", value: "Smile" }
      ]
    },
    {
      tokenId: 7,
      name: "Townie #7",
      image: "images/7.png",
      attributes: [
        { trait_type: "Background", value: "Red" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Sweatpants" },
        { trait_type: "Shirt", value: "Hoodie" },
        { trait_type: "Hair", value: "Curly Black" },
        { trait_type: "Eyes", value: "Wide Open" },
        { trait_type: "Hat", value: "Beanie" },
        { trait_type: "Mouth", value: "Straight" }
      ]
    },
    {
      tokenId: 8,
      name: "Townie #8",
      image: "images/8.png",
      attributes: [
        { trait_type: "Background", value: "Yellow" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Khakis" },
        { trait_type: "Shirt", value: "Blazer" },
        { trait_type: "Hair", value: "Straight Brown" },
        { trait_type: "Eyes", value: "Looking Left" },
        { trait_type: "Hat", value: "Cowboy Hat" },
        { trait_type: "Mouth", value: "Frown" }
      ]
    },
    {
      tokenId: 9,
      name: "Townie #9",
      image: "images/9.png",
      attributes: [
        { trait_type: "Background", value: "Green" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Joggers" },
        { trait_type: "Shirt", value: "Sweater" },
        { trait_type: "Hair", value: "Wavy Blonde" },
        { trait_type: "Eyes", value: "Closed" },
        { trait_type: "Hat", value: "Flat Cap" },
        { trait_type: "Mouth", value: "Smirk" }
      ]
    },
    {
      tokenId: 10,
      name: "Townie #10",
      image: "images/10.png",
      attributes: [
        { trait_type: "Background", value: "Pink" },
        { trait_type: "Townie", value: "OG" },
        { trait_type: "Pants", value: "Jeans" },
        { trait_type: "Shirt", value: "Graphic Tee" },
        { trait_type: "Hair", value: "Buzz Cut" },
        { trait_type: "Eyes", value: "Staring" },
        { trait_type: "Hat", value: "Top Hat" },
        { trait_type: "Mouth", value: "Wide Smile" }
      ]
    }
  ];

  const traitTypes = ["Background", "Townie", "Pants", "Shirt", "Hair", "Eyes", "Hat", "Mouth"];
  const traitValues = {};

  // Populate trait values for filters
  jsonData.forEach((item) => {
    item.attributes.forEach((attr) => {
      if (!traitValues[attr.trait_type]) {
        traitValues[attr.trait_type] = new Set();
      }
      traitValues[attr.trait_type].add(attr.value);
    });
  });

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

  filters.addEventListener("change", applyFilters);

  // Initialize
  renderFilters();
  renderGallery(jsonData);
});