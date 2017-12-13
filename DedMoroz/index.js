/*Create Animate Dead Morose */
function createDed(url) {
  if (document) {
    var dedWrapper = document.createElement('div');
    dedWrapper.className = 'wrapperDed';
    document.body.appendChild(dedWrapper);

    var ded = document.createElement('div');
    ded.className = 'dedClass';
    document.getElementsByClassName('wrapperDed')[0].appendChild(ded);

    var snow = document.createElement('div');
    snow.className = 'snow';
    document.body.appendChild(snow);

    ded.addEventListener('click',openPopUp, false);

    var wr = document.getElementsByClassName('wrapperDed')[0];
    var inr = document.getElementsByClassName('dedClass')[0];
    var sn = document.getElementsByClassName('snow')[0];

    var scrollStop = function ( callback ) {
      // Make sure a valid callback was provided
      if ( !callback || Object.prototype.toString.call( callback ) !== '[object Function]' ) return;
      // Setup scrolling variable
      var isScrolling;
      // Listen for scroll events
      window.addEventListener('scroll', function ( event ) {

        if(!wr.style.animation || !wr.style.animation.includes('infinite')){
          console.log('scroll');
          wr.style.animation = 'drawArc1 3.2s linear infinite';
          inr.style.animation = 'drawArc2 3.2s linear infinite';
          //sn.style.animation = 'drawArc2 3.2s linear infinite';
        }
        // Clear our timeout throughout the scroll
        window.clearTimeout( isScrolling );
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function() {
          // Run the callback
          callback();
        }, 3200);
      }, false);
    };

    scrollStop(function () {

    });

    var PopUpText = [
      {
        title: 'Бухгалтерия в подарок',
        content: '3 месяца бухгалтерии в подарок при покупке годового тарифа',
        promo: 'БухгалтерияВПодарок'
      },
      {
        title: 'Тест Драйв',
        content: 'Дарим 3 месяца бесплатного обслуживания на тарифе Оптимальный',
        promo: 'ТестДрайв'
      },
      {
        title: 'Попробуй банк',
        content: 'Бесплатный месяц обслуживания на любом тарифе!',
        promo: 'ПопробуйБанк'
      },
      {
        title: 'Белый бизнес',
        content: 'Бесплатный мониторинг риска блокировки счета!',
        promo: 'БелыйБизнес'
      }
    ];

    var randomTextObj;
    var randomNumber;

    function openPopUp(e) {

      document.body.style.overflow = 'hidden';
      document.getElementsByClassName('wrapperDed')[0].style.visibility = 'hidden';
      document.getElementsByClassName('snow')[0].style.visibility = 'hidden';

      if(!document.getElementsByClassName('modal').length){
        console.log('here 76');
        randomNumber = Math.floor((Math.random() * 3));
        randomTextObj = PopUpText[randomNumber];
        var popUp = document.createElement('div');
        popUp.className = 'modal';
        document.body.appendChild(popUp);

        var wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        wrapper.innerHTML = '<div class="title">' + randomTextObj.title + '</div>';
        wrapper.innerHTML += '<div class="content">' + randomTextObj.content + '</div>';
        document.getElementsByClassName('modal')[0].appendChild(wrapper);

        var cross = document.createElement('div');
        cross.className = 'cross';
        cross.innerText = 'x';
        document.getElementsByClassName('wrapper')[0].appendChild(cross);

        cross.addEventListener('click',closePopUp, false);
        // document.getElementsByClassName('modal')[0].addEventListener('click',closePopUp, false);

        var inputPhone = document.createElement('input');
        inputPhone.className = 'inputClass';
        inputPhone.size = 45;
        inputPhone.placeholder = 'Номер телефона';
        document.getElementsByClassName('wrapper')[0].appendChild(inputPhone);

        var button = document.createElement('button');
        button.className = 'buttonClass';
        button.innerText = 'Получить подарок';
        document.getElementsByClassName('wrapper')[0].appendChild(button);

        button.addEventListener('click',sendRequest, false);

        var popUpContent = document.createElement('div');
        popUpContent.className = 'modalContent';
        document.getElementsByClassName('wrapper')[0].appendChild(popUpContent);
      } else {
        document.getElementsByClassName('modal')[0].style.visibility = 'visible';
      }
    }

    function sendRequest(e) {
      var phone = document.getElementsByClassName('inputClass')[0].value;
      var xhr = new XMLHttpRequest();
      var body = 'city=Moscow&phone=' + phone;
      xhr.open('POST',url , true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send(body);

      xhr.onreadystatechange = processRequest;

      function processRequest(e){
        if (xhr.readyState == 4 && xhr.status == 200) {
          var modal = document.getElementsByClassName('modalContent')[0];
          modal.className = 'getRequest';
          document.getElementsByClassName('title')[0].innerText = 'Заявка принята!';
          document.getElementsByClassName('content')[0].innerText = 'Скоро вам позвонит менеджер, для активации бонуса назовите ему промокод:';
          document.getElementsByClassName('buttonClass')[0].style.display = 'none';
          document.getElementsByClassName('inputClass')[0].style.display = 'none';
          document.getElementsByClassName('cross')[0].style.display = 'none';
          var promo = document.createElement('div');
          promo.className = 'promo';
          promo.innerText = '#' + randomTextObj.promo;
          document.getElementsByClassName('wrapper')[0].appendChild(promo);
          setTimeout(function () {
           document.getElementsByClassName('modal')[0].style.display = 'none';
           document.getElementsByClassName('wrapperDed')[0].style.display = 'none';
           document.getElementsByClassName('snow')[0].style.display = 'none';
           document.body.style.overflow = 'auto';
           }, 20000);
        }
      }
    }

    function closePopUp(e) {
      document.getElementsByClassName('modal')[0].style.visibility = 'hidden';
      document.getElementsByClassName('wrapperDed')[0].style.visibility = 'visible';
      document.getElementsByClassName('snow')[0].style.visibility = 'visible';
      document.body.style.overflow = 'auto';
    }
  }
}
