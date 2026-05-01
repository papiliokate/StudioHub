# Custom Domain Configuration

The ecosystem has been migrated to use a custom domain.

- **Primary Domain**: `oops-games.com`
- **Usage**: All hardcoded instances of `https://oops-games-hub.web.app` in routing, carousel logic, iframe embeds, and Zapier distributions should ideally be updated or constructed using `https://oops-games.com`. 
- **Examples**:
  - Publisher Portal: `https://oops-games.com/publishers.html`
  - Carousel: `https://oops-games.com/?carousel=true`
  - Presale: `https://oops-games.com/presale.html`

When writing new code or updating ecosystem links, rely on the custom domain instead of the `.web.app` Firebase domain.
