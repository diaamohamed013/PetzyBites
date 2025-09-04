(function() {
    "use strict";

    const modal = document.getElementById("myModal");
    const btn = document.getElementById("openFormBtn");
    const spanClose = document.getElementsByClassName("close")[0];

    const preveiwContainer = document.querySelector('.products-preview');
    const previewBox = preveiwContainer ? preveiwContainer.querySelectorAll('.preview') : [];

    function loadExistingImages() {
        console.log('بدء جلب الصور...');
        fetch('get_images.php')
            .then(response => {
                console.log('تم استلام الرد:', response);
                return response.json();
            })
            .then(data => {
                console.log('البيانات المستلمة:', data);
                if (!Array.isArray(data)) {
                    console.error('البيانات المستلمة ليست مصفوفة:', data);
                    return;
                }

                document.getElementById('cats-section').innerHTML = '';
                document.getElementById('dogs-section').innerHTML = '';
                document.getElementById('young-pets-section').innerHTML = '';


                data.forEach(image => {
                    console.log('معالجة الصورة:', image);
                    console.log('مسار الصورة من البيانات:', image.image_path); 

                    if (!image.image_path || image.image_path.trim() === '') {
                        console.warn('تخطي الصورة لوجود مسار صورة فارغ أو مفقود:', image);
                        return;
                    }

                    const albumIdMap = {
                        'Cats': 'cats-section',
                        'Dogs': 'dogs-section',
                        'Kittens': 'young-pets-section', 
                        'Puppies': 'young-pets-section'  
                    };
                    const albumSectionId = albumIdMap[image.album];
                    const albumSection = document.getElementById(albumSectionId);


                    if (albumSection) {
                        const swiperSlide = document.createElement('div');
                        swiperSlide.className = 'swiper-slide';

                        const img = document.createElement('img');
                        img.src = image.image_path; 
                        img.alt = image.pet_name || 'صورة حيوان أليف';
                        img.loading = 'lazy'; 

                        img.onerror = function() {
                            console.error('خطأ في تحميل الصورة، جاري الإزالة:', this.src);
                            this.closest('.swiper-slide').remove();
                        };

                        const petInfo = document.createElement('div');
                        petInfo.className = 'pet-info'; 
                        petInfo.innerHTML = `
                            <h3>${image.pet_name}</h3>
                            <p><strong>Owner:</strong> ${image.full_name}</p>
                            <p>${image.description}</p>
                        `;

                        swiperSlide.appendChild(img);
                        swiperSlide.appendChild(petInfo);
                        albumSection.appendChild(swiperSlide);
                        console.log('تم إضافة الصورة إلى القسم:', albumSectionId);
                    } else {
                        console.error('لم يتم العثور على القسم:', albumSectionId, 'للألبوم:', image.album);
                    }
                });


            })
            .catch(error => {
                console.error('حدث خطأ في جلب الصور:', error);
            });
    }


    if (btn && modal && spanClose) {
        btn.onclick = function() {
            modal.style.display = "flex"; 
        }

        spanClose.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    if (preveiwContainer) {
        document.querySelectorAll('.products-container .product').forEach(product => {
            product.onclick = () => {
                preveiwContainer.style.display = 'flex';
                let name = product.getAttribute('data-name');
                previewBox.forEach(preview => {
                    let target = preview.getAttribute('data-target');
                    if (name == target) {
                        preview.classList.add('active');
                    }
                });
            };
        });

        previewBox.forEach(preview => {
            let closeBtn = preview.querySelector('.fa-times');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    preview.classList.remove('active');
                    preveiwContainer.style.display = 'none';
                };
            }
        });

        document.querySelectorAll('.products-preview .buy').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                previewBox.forEach(preview => preview.classList.remove('active'));
                preveiwContainer.style.display = 'none';
            });
        });
    }

    function toggleScrolled() {
        const selectBody = document.querySelector('body');
        const selectHeader = document.querySelector('#header');
        if (!selectHeader || !selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
        window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }

    if (document.querySelector('#header')) {
        document.addEventListener('scroll', toggleScrolled);
        window.addEventListener('load', toggleScrolled);
    }

    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const selectHeader = document.querySelector('#header');
        if (!selectHeader.classList.contains('scroll-up-sticky')) return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > selectHeader.offsetHeight) {
            selectHeader.style.setProperty('position', 'sticky', 'important');
            selectHeader.style.top = `-${selectHeader.offsetHeight + 50}px`; 
        } else if (scrollTop > selectHeader.offsetHeight) {
            selectHeader.style.setProperty('position', 'sticky', 'important');
            selectHeader.style.top = "0";
        } else {
            selectHeader.style.removeProperty('top');
            selectHeader.style.removeProperty('position');
        }
        lastScrollTop = scrollTop;
    });


    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn) {
        function mobileNavToogle() {
            document.querySelector('body').classList.toggle('mobile-nav-active');
            mobileNavToggleBtn.classList.toggle('bi-list');
            mobileNavToggleBtn.classList.toggle('bi-x');
        }
        mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    }


    const navmenu = document.querySelector('#navmenu');
    if (navmenu) {
        document.querySelectorAll('#navmenu a').forEach(navmenu => {
            navmenu.addEventListener('click', () => {
                if (document.querySelector('.mobile-nav-active')) {
                    mobileNavToogle();
                }
            });
        });
    }


    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentNode.classList.toggle('active');
            this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
        });
    });


    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }


    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
        function toggleScrollTop() {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        window.addEventListener('load', toggleScrollTop);
        document.addEventListener('scroll', toggleScrollTop);
    }


    if (typeof AOS !== 'undefined') {
        function aosInit() {
            AOS.init({
                duration: 600,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
        window.addEventListener('load', aosInit);
    }


    document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
        carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
            if (index === 0) {
                carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
            } else {
                carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
            }
        });
    });


    if (typeof Swiper !== 'undefined') {
        function initSwiper() {
            document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
                let config = JSON.parse(
                    swiperElement.querySelector(".swiper-config").innerHTML.trim()
                );
                new Swiper(swiperElement, config);
            });
        }
        window.addEventListener("load", initSwiper);
    }


    if (typeof GLightbox !== 'undefined') {
        const glightbox = GLightbox({
            selector: '.glightbox'
        });
    }


    window.addEventListener('load', function() {
        console.log('تم تحميل الصفحة، جاري استدعاء loadExistingImages');
        loadExistingImages();
    });
})();







	let testSlide = document.querySelectorAll('.testItem');
	let dots = document.querySelectorAll('.dot');

	var counter = 0;

	function switchTest(currentTest){
		currentTest.classList.add('active');
		var testId = currentTest.getAttribute('attr');
		if(testId > counter){
			testSlide[counter].style.animation = 'next1 0.5s ease-in forwards';
			counter = testId;
			testSlide[counter].style.animation = 'next2 0.5s ease-in forwards';
		}
		else if(testId == counter){return;}
		else{
			testSlide[counter].style.animation = 'prev1 0.5s ease-in forwards';
			counter = testId;
			testSlide[counter].style.animation = 'prev2 0.5s ease-in forwards';
		}
		indicators();
	}

	function indicators(){
		for(i = 0; i < dots.length; i++){
			dots[i].className = dots[i].className.replace(' active', '');
		}
		dots[counter].className += ' active';
	}

	function slideNext(){
		testSlide[counter].style.animation = 'next1 0.5s ease-in forwards';
		if(counter >= testSlide.length - 1){
			counter = 0;
		}
		else{
			counter++;
		}
		testSlide[counter].style.animation = 'next2 0.5s ease-in forwards';
		indicators();
	}
	function autoSliding(){
		deleteInterval = setInterval(timer, 2000);
		function timer(){
			slideNext();
			indicators();
		}
	}
	autoSliding();

	const container = document.querySelector('.indicators');
	container.addEventListener('mouseover', pause);
	function pause(){
		clearInterval(deleteInterval);
	}

	container.addEventListener('mouseout', autoSliding);
