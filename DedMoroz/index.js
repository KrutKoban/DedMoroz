/*Create Animate Dead Morose */
/**
 * Input Masks
 */

function inputMask() {



  let identifiers = [
    { character: '#', match: '[0-9]' },
    { character: 'a', match: '[A-Za-z]' }
  ];

  function getMatchForChar(char) {
    return identifiers.reduce((out, iden) => {
          return iden.character === char ? iden.match : out;
  }, null);
  }

  function matchChar(match, char) {
    let regex = new RegExp(match);
    return regex.test(char);
  }

  function matchInput(str, mask) {
    if (str.length !== mask.length) return false;

    // look at chars one by one
    let strChars = str.split('');
    return strChars.every((char, i) => {
          let maskCharAtPos = mask[i];
    let matchStr = getMatchForChar(maskCharAtPos);
    return matchStr === null && maskCharAtPos === char || matchChar(matchStr, char);
  });
  }



  function strToMask(str, mask) {
    let string = str.split('');
    let output = mask.split('').reduce((out, maskChar, i) => {
          let strChar = string.shift();
    let match = getMatchForChar(maskChar);
    let allowedChar = matchChar(match, strChar);

    if (match && allowedChar) return replaceCharAtPos(out, i, strChar);

    string.unshift(strChar);
    return out;
  }, mask);

    return matchInput(output, mask) ? output : null;
  }



  function findNextIdentifier(str, index = 0) {
    let string = index > 0 ? str.substr(index) : str;
    let chars = identifiers.map(x => x.character);
    return string.split('').reduce((int, char, i) => {
          let isIdentifier = chars.indexOf(char) > -1;
    let result = index > 0 ? i + index : i;
    if (int > -1) return int;
    return isIdentifier ? result : int;
  }, -1);
  }



  function replaceCharAtPos(str, pos, char) {
    if (!char) return str;
    return str.substr(0, pos) + char + str.substr(pos + 1);
  }



  function setCursorPosition(el, index = 0) {
    el.setSelectionRange(index, index);
  }



  function focusHandler(event) {
    let mask = this.mask;
    let placeholder = this.placeholder;
    let index = findNextIdentifier(mask);

    if (event.target.value === '') {
      event.target.value = this.placeholder;
      setCursorPosition(event.target, index);
    } else if (matchInput(event.target.value, mask)) {
      setCursorPosition(event.target, placeholder.length);
    } else {
      index = event.target.value.split('')
              .reduce((num, char, i) => {
            let matchStr = getMatchForChar(mask[i]);

      if (matchChar(matchStr, char)) return i + 1;
      if (placeholder[i] === char) return num;

      return num;
    }, index);

      setCursorPosition(event.target, findNextIdentifier(mask, index));
    }
  }


  function keypressHandler(event) {
    let value = event.target.value;
    let cursorPos = event.target.selectionStart;
    let keyCode = event.keyCode;
    let character = String.fromCharCode(event.charCode);

    // get chars at cursor position
    let maskCharAtPos = this.mask[cursorPos];
    let maskCharNext = this.mask[cursorPos + 1];
    let valCharAtPos = value[cursorPos];
    let valCharNext = value[cursorPos + 1];

    // check if event key is allowed by mask char
    let charAllowed = identifiers.reduce((bool, iden) => {
          return iden.character === maskCharAtPos ? matchChar(iden.match, character) : bool;
  }, false);

    // index of next idenfitier char
    let nextPos = findNextIdentifier(this.mask, cursorPos);
    if (nextPos === cursorPos || getMatchForChar(maskCharNext) === null) {
      nextPos = findNextIdentifier(this.mask, cursorPos + 1);
    }

    // prevent default for all keys except tab, enter and arrows
    if ([9, 13, 37, 38, 39, 40].indexOf(keyCode) === -1) {
      event.preventDefault();
    }

    // handle other allowed keypresses
    if (!charAllowed && character !== valCharAtPos) {
      // backspace
      if (keyCode === 8) {
        event.target.value = replaceCharAtPos(value, cursorPos - 1, this.placeholder[cursorPos - 1]);
        setCursorPosition(event.target, cursorPos - 1);
        // space
      } else if (keyCode === 32) {
        if (maskCharNext && maskCharNext === valCharNext) {
          setCursorPosition(event.target, nextPos);
        }
      }

      // then, exit the callback
      return;
    }

    // update input value with event char at cursor position
    event.target.value = replaceCharAtPos(value, cursorPos, character);

    // move cursor to the next identifier
    if (nextPos > -1) setCursorPosition(event.target, nextPos);
  }

  function blurHandler(event) {
    let match = matchInput(event.target.value, this.mask);

    if (match && this.onMatch) this.onMatch(event.target.value);
    if (!match && this.onFail) this.onFail();
    if (!match && this.clearOnFail !== false) event.target.value = '';
  }


  function inputMask(el, settings) {
    if (typeof settings === 'string') settings = { mask: settings };
    if (!settings.placeholder) settings.placeholder = settings.mask;
    if (!settings.mask || typeof settings.mask !== 'string') {
      throw new Error('inputMask called with invalid mask string: ' + settings.mask);
    }

    let parsedValue = strToMask(el.value, settings.mask);
    if (parsedValue) {
      el.value = parsedValue;
      if (settings.onMatch) settings.onMatch(parsedValue);
    }

    el.addEventListener('focus', focusHandler.bind(settings));
    el.addEventListener('keypress', keypressHandler.bind(settings));
    el.addEventListener('blur', blurHandler.bind(settings));
  }


  inputMask.addIdentifier = function(identifier) {
    if (!identifier || !identifier.character || !identifier.match) {
      throw new Error('New identifier must contain a character and a match.');
    }

    if (identifier.character.length > 1) {
      throw new Error('Identifier character must have length of 1.');
    }

    if (getMatchForChar(identifier.character) !== null) {
      throw new Error('Identifier already exists for character ' + identifier.character);
    }

    identifiers.push({ character: identifier.character, match: identifier.match });
  };

  inputMask.removeIdentifier = function(character) {
    let identifier =
        identifiers.filter((iden) => iden.character === character)[0];

    let index = identifiers.indexOf(identifier);
    if (identifier && index > -1) return identifiers.splice(index, 1);
    throw new Error('Could not find identifier for character ' + character);
  };

  // export the function
  window.inputMask = inputMask;

};


function createDed(url) {
  if (document) {
    if(document.cookie.indexOf('popupDedMoroz') === -1) {
      document.cookie = 'popupDedMoroz=true; path=/; expires="Tue, 19 Jan 2027 03:14:07 GMT';
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
          //inputPhone.placeholder = 'Номер телефона';
          document.getElementsByClassName('wrapper')[0].appendChild(inputPhone);

          var button = document.createElement('button');
          button.className = 'buttonClass';
          button.innerText = 'Получить подарок';
          document.getElementsByClassName('wrapper')[0].appendChild(button);

          button.addEventListener('click',sendRequest, false);

          var popUpContent = document.createElement('div');
          popUpContent.className = 'modalContent';
          document.getElementsByClassName('wrapper')[0].appendChild(popUpContent);
          invokeMask();
        } else {
          document.getElementsByClassName('modal')[0].style.visibility = 'visible';
        }
      }

      function sendRequest(e) {
        var phone = document.getElementsByClassName('inputClass')[0].value;
          var xhr = new XMLHttpRequest();
          phone = phone.replace(/[\(\)\-]/g,'');
          console.log('phone is :', phone);
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
}

function invokeMask(){
  inputMask(document.getElementsByClassName('inputClass')[0], {

    mask: '+7(###)-###-##-##',

    placeholder: '+7(___)-___-__-__',

    onMatch: function(value) {
      console.log('Value ' + value + ' matches the input mask.');
    },

    onFail: function() {
      console.log('No match was found for that value.');
    },

    clearOnFail: false
  });
}
