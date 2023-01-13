function attachPlugIn($) {
  // jQuery 1.12.4
  $.fn.extend({
    name: function pickName(selector) {
      if (!selector || typeof selector !== "string") {
        return this;
      }
      selector = "[name='" + selector + "']";

      return $(this).find(selector);
    }
  });
  return $;
}

export default attachPlugIn;
