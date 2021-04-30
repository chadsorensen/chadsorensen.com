var jQuery = require("jquery");
var $ = require("jquery");
var helloNavigation, mobileNavigation, smoothScroll, verticalNavigation;

$(function() {
  var $contentSections, $header, $hello, $helloNavigation, $navTrigger, $navigationItems, $verticalNavigation, checkScroll, isAnimating, loadWorks, scrolling, setBottomScroll, setNavigationScroll, updateSections;
  scrolling = false;
  isAnimating = false;
  $header = $('#header nav');
  $hello = $('#hello');
  $contentSections = $('section');
  $verticalNavigation = $('.cd-vertical-nav');
  $navigationItems = $('.cd-vertical-nav a');
  $helloNavigation = $('#hello');
  $navTrigger = $('.cd-nav-trigger');
  $hello.addClass('active');
  helloNavigation($helloNavigation);
  verticalNavigation($verticalNavigation);
  mobileNavigation($navTrigger, $verticalNavigation);

  checkScroll = function() {
    if (!scrolling) {
      scrolling = true;
      if (!window.requestAnimationFrame) {
        return setTimeout(updateSections, 300);
      } else {
        return window.requestAnimationFrame(updateSections);
      }
    }
  };
  updateSections = function() {
    var halfWindowHeight, scrollTop;
    halfWindowHeight = $(window).height() / 2;
    scrollTop = $(window).scrollTop();
    $contentSections = $('section');
    $contentSections.each(function() {
      var $navigationItem, $section, sectionId;
      $section = $(this);
      sectionId = $section.attr('id');
      $navigationItem = $navigationItems.filter('[href^="#' + sectionId + '"]');
      setNavigationScroll($section);
      return setBottomScroll($section);
    });
    return scrolling = false;
  };
  setNavigationScroll = function($section) {
    halfWindowHeight = $(window).height() / 2;
    scrollTop = $(window).scrollTop();
    sectionId = $section.attr('id');
    $navigationItem = $navigationItems.filter('[href^="#' + sectionId + '"]');
    if ($section.offset().top - halfWindowHeight < scrollTop && $section.offset().top + $section.height() - halfWindowHeight > scrollTop) {
      return $navigationItem.addClass('active');
    } else {
      return $navigationItem.removeClass('active');
    }
  };
  setBottomScroll = function($section) {
    var $activeNav, $activeSection;
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
      $navigationItem.removeClass('active');
      $activeSection = $('#contact');
      $activeNav = $navigationItems.filter('[href^="#contact"]');
      $activeNav.addClass('active');
      return $activeSection.addClass('active');
    }
  };

  return $(window).on('scroll', checkScroll);
});

smoothScroll = function(target) {
  $('body,html').animate({
    'scrollTop': target.offset().top
  }, 500);
};

helloNavigation = function($helloNavigation) {
  $helloNavigation.on('click', 'a', function(event) {
    event.preventDefault();
    return smoothScroll($(this.hash));
  });
};

verticalNavigation = function($verticalNavigation) {
  $verticalNavigation.on('click', 'a', function(event) {
    event.preventDefault();
    smoothScroll($(this.hash));
    return $verticalNavigation.removeClass('open');
  });
};

mobileNavigation = function($navTrigger, $verticalNavigation) {
  $navTrigger.on('click', function(event) {
    event.preventDefault();
    return $verticalNavigation.toggleClass('open');
  });
};
