$(document).ready(function () {
  // فتح/قفل القايمة بالضغط على اللينك
  $(".dmenu > .nav-link.dropdown-toggle").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $link = $(this);
    const $menu = $link.next(".sm-menu");

    // اقفل باقي القوائم وشيّل اي فوكس عن اللي كانت فاتحة
    $(".sm-menu")
      .not($menu)
      .slideUp(150, function () {
        $(this).prev(".nav-link.dropdown-toggle").blur();
      });

    // افتح/قفل الحالية — وبنستخدم callback علشان نعمل blur بعد ما تخلص الحركة لو اتقفلت
    $menu.stop(true, true).slideToggle(150, function () {
      // حدّث aria-expanded (كوّنية الوصول)
      $link.attr("aria-expanded", $menu.is(":visible"));
      // لو القايمة اتقفلت، شيل الفوكس علشان يروح ستايل :focus/:hover
      if (!$menu.is(":visible")) {
        $link.blur();
      } else {
        // اختياري: لو عايز نخلي الفوكس موجود للـ keyboard accessibility
        $link.focus();
      }
    });
  });

  // كليك برّه: اقفل الكل وشيل الفوكس من الروابط
  $(document).on("click", function () {
    $(".sm-menu").slideUp(150);
    $(".nav-link.dropdown-toggle").blur();
    $(".nav-link.dropdown-toggle").attr("aria-expanded", "false");
  });

  // Escape يقفل ويشيل الفوكس
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      $(".sm-menu").slideUp(150);
      $(".nav-link.dropdown-toggle").blur();
      $(".nav-link.dropdown-toggle").attr("aria-expanded", "false");
    }
  });

  // لو الكليك جوّه الميجا ميّنو، مايقفلهاش
  $(".megamenu").on("click", function (e) {
    e.stopPropagation();
  });
});
