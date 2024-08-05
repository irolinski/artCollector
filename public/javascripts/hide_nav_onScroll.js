function testScroll(ev) {
  if (window.pageYOffset > 100) {
    document.querySelector("#navbar").style.opacity = "0.02";
  } else {
    document.querySelector("#navbar").style.opacity = "1";
  }
}
window.onscroll = testScroll;
