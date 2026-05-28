zeeschuimer.register_module(
  "Property.ie",
  "property.ie",
  function (response, source_platform_url, source_url) {
    let domain = source_platform_url
      .split("/")[2]
      .toLowerCase()
      .replace(/^www\./, "");

    if (!["property.ie"].includes(domain)) {
      return [];
    }

    let doc;
    try {
      doc = new DOMParser().parseFromString(response, "text/html");
    } catch (e) {
      return [];
    }

    const items = [];

    doc.querySelectorAll("div.search_result").forEach((card) => {
      // Extract listing ID from the save-ad span class e.g. "id_s_6569152" (sale) or "id_r_6583652" (rental)
      let id = null;
      const saveAdEl = card.querySelector("span.sresult_savead");
      if (saveAdEl) {
        for (const cls of saveAdEl.classList) {
          const match = cls.match(/^id_[srnc]_(\d+)$/);
          if (match) {
            id = match[1];
            break;
          }
        }
      }

      const linkEl = card.querySelector("div.sresult_address h2 a");
      const href = linkEl ? linkEl.getAttribute("href") : null;

      // Fallback: extract ID from URL path e.g. ".../6569152/"
      if (!id && href) {
        const urlMatch = href.match(/\/(\d+)\/?$/);
        if (urlMatch) id = urlMatch[1];
      }

      if (!id) return;

      const address = linkEl ? linkEl.textContent.trim() : null;
      const url = href || null;

      const priceEl = card.querySelector("div.sresult_description h3");
      const price = priceEl ? priceEl.textContent.trim() : null;

      // h4 format varies by listing type:
      //   Sale:       "N Bedrooms, N Bathrooms, Property Type"
      //   Rental:     "N bedroom[s][ (details)], N bathroom[s][, furnishing] Type to Rent"
      //   Studio:     "Studio[ (details)] Studio apartment to Rent"
      //   New homes:  "N - M Bedrooms - For Sale"
      //   Commercial: "N,NNN sq. feet (N sq. metres) Property Type [To Let/For Sale]"
      const detailsEl = card.querySelector("div.sresult_description h4");
      const detailsText = detailsEl ? detailsEl.textContent.trim() : "";
      let bedrooms = null;
      let bathrooms = null;
      let furnished = null;
      let floor_area = null;
      let property_type = null;

      let bedrooms_max = null;
      const bedsMatch = detailsText.match(/(\d+)\s*(?:-\s*(\d+)\s*)?bedrooms?/i);
      if (bedsMatch) {
        bedrooms = parseInt(bedsMatch[1]);
        if (bedsMatch[2]) bedrooms_max = parseInt(bedsMatch[2]);
      }

      const bathsMatch = detailsText.match(/(\d+)\s+bathrooms?/i);
      if (bathsMatch) bathrooms = parseInt(bathsMatch[1]);

      const furnishedMatch = detailsText.match(
        /\b(furnished\s+or\s+unfurnished|unfurnished|furnished)\b/i
      );
      if (furnishedMatch) furnished = furnishedMatch[1].toLowerCase().replace(/\s+/g, " ");

      const floorAreaMatch = detailsText.match(
        /([\d,.]+\s+sq\.\s+feet\s+\([^)]+\)|[\d.]+\s+acres?\s+\([^)]+\))/i
      );
      if (floorAreaMatch) floor_area = floorAreaMatch[1].trim();

      // Strip bed/bath counts (with optional parenthetical room details), furnishing
      // status, and floor area to isolate the property type at the end of the h4 text.
      let typeStr = detailsText
        .replace(/[\d,.]+\s+sq\.\s+feet\s+\([^)]+\)\s*/gi, "")
        .replace(/[\d.]+\s+acres?\s+\([^)]+\)\s*/gi, "")
        .replace(/\d+\s*(?:-\s*\d+\s*)?bedrooms?\s*(\([^)]*\))?\s*[-,]?\s*/gi, "")
        .replace(/\d+\s+bathrooms?\s*(\([^)]*\))?\s*[-,]?\s*/gi, "")
        .replace(/\b(furnished\s+or\s+unfurnished|unfurnished|furnished)\b\s*/gi, "")
        .replace(/^Studio\s*(\([^)]*\))?\s*/i, "")
        .replace(/^[,\s]+|[,\s]+$/g, "")
        .trim();
      if (typeStr) property_type = typeStr;

      // Available-from date (rental listings only)
      const availableEl = card.querySelector("span.sresult_available_from");
      let available_from = null;
      if (availableEl) {
        available_from = availableEl.textContent
          .replace(/-\s*$/, "")
          .trim() || null;
      }

      const descEl = card.querySelector("div.sresult_description p");
      let description = null;
      if (descEl) {
        const descClone = descEl.cloneNode(true);
        const avail = descClone.querySelector("span.sresult_available_from");
        if (avail) avail.remove();
        description = descClone.textContent.trim() || null;
      }

      // Listing image: prefer data-original (lazy-loaded real URL) over src,
      // and treat the placeholder no_image paths as absent.
      let image_url = null;
      const imgEl = card.querySelector("img.thumb");
      if (imgEl) {
        const candidate =
          imgEl.getAttribute("data-original") || imgEl.getAttribute("src");
        if (candidate && !candidate.includes("/fronts/pie/no_image")) {
          image_url = candidate;
        }
      }

      // BER rating from image src e.g. "ber_C1.png"
      let ber_rating = null;
      const berEl = card.querySelector("div.ber-search-results img");
      if (berEl) {
        const berMatch = (berEl.getAttribute("src") || "").match(
          /ber_([^.]+)\.png/i
        );
        if (berMatch) ber_rating = berMatch[1];
      }

      const agentEl = card.querySelector("img.agent_logo");
      const agent = agentEl
        ? agentEl.getAttribute("alt").replace(/\s*Logo\s*$/i, "").trim()
        : null;

      let listing_type = null;
      if (source_platform_url.includes("/property-for-sale/")) {
        listing_type = "sale";
      } else if (source_platform_url.includes("/property-to-let/")) {
        listing_type = "rent";
      } else if (source_platform_url.includes("/new-homes/")) {
        listing_type = "new_home";
      } else if (source_platform_url.includes("/commercial-property/")) {
        listing_type = "commercial";
      }

      items.push({
        id,
        url,
        address,
        price,
        bedrooms,
        bedrooms_max,
        bathrooms,
        furnished,
        floor_area,
        property_type,
        available_from,
        description,
        image_url,
        ber_rating,
        agent,
        listing_type,
      });
    });

    return items;
  }
);
