const toggleCollapse = (inputClass) => {
  for (el of document.querySelectorAll(inputClass)) {
    if (!el.classList.contains("show")) {
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  }
};
