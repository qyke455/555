/* Кафе «Уют» — поведение страницы: год в подвале, маска телефона,
   валидация и состояние «заявка отправлена».
   Форма демонстрационная: данные никуда не уходят.
   Чтобы подключить реальную отправку — см. пометку ЗАГЛУШКА в конце файла. */
(function () {
  'use strict';

  /* ---------- Год в подвале ------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var form = document.getElementById('booking-form');
  if (!form) {
    return;
  }

  var nameInput = document.getElementById('name');
  var phoneInput = document.getElementById('phone');
  var consentInput = document.getElementById('consent');
  var nameError = document.getElementById('name-error');
  var phoneError = document.getElementById('phone-error');
  var consentError = document.getElementById('consent-error');
  var successBox = document.getElementById('booking-success');
  var successText = document.getElementById('booking-success-text');

  /* ---------- Маска телефона ---------------------------------------------- */
  function onlyDigits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function formatPhone(raw) {
    var digits = onlyDigits(raw);
    if (!digits) {
      return '';
    }
    if (digits.charAt(0) === '8') {
      digits = '7' + digits.slice(1);
    }
    if (digits.charAt(0) !== '7') {
      digits = '7' + digits;
    }
    digits = digits.slice(0, 11);

    var out = '+7';
    if (digits.length > 1) {
      out += ' (' + digits.slice(1, 4);
    }
    if (digits.length >= 5) {
      out += ') ' + digits.slice(4, 7);
    }
    if (digits.length >= 8) {
      out += '-' + digits.slice(7, 9);
    }
    if (digits.length >= 10) {
      out += '-' + digits.slice(9, 11);
    }
    return out;
  }

  phoneInput.addEventListener('input', function () {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  phoneInput.addEventListener('blur', function () {
    if (onlyDigits(phoneInput.value).length <= 1) {
      phoneInput.value = '';
    }
  });

  /* ---------- Ошибки полей ------------------------------------------------- */
  function setFieldError(input, errorEl, message) {
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function validateName() {
    var value = nameInput.value.trim();
    if (value.length < 2) {
      setFieldError(nameInput, nameError, 'Укажите имя — хотя бы 2 буквы.');
      return false;
    }
    setFieldError(nameInput, nameError, '');
    return true;
  }

  function validatePhone() {
    if (onlyDigits(phoneInput.value).length !== 11) {
      setFieldError(phoneInput, phoneError, 'Введите номер полностью: +7 (999) 123-45-67.');
      return false;
    }
    setFieldError(phoneInput, phoneError, '');
    return true;
  }

  function validateConsent() {
    if (!consentInput.checked) {
      consentError.textContent = 'Нужно согласие на обработку персональных данных.';
      consentError.hidden = false;
      return false;
    }
    consentError.textContent = '';
    consentError.hidden = true;
    return true;
  }

  nameInput.addEventListener('blur', validateName);
  phoneInput.addEventListener('blur', validatePhone);
  consentInput.addEventListener('change', validateConsent);

  /* ---------- Отправка ----------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var nameOk = validateName();
    var phoneOk = validatePhone();
    var consentOk = validateConsent();

    if (!nameOk) {
      nameInput.focus();
      return;
    }
    if (!phoneOk) {
      phoneInput.focus();
      return;
    }
    if (!consentOk) {
      consentInput.focus();
      return;
    }

    var name = nameInput.value.trim();
    var phone = formatPhone(phoneInput.value);

    /* ЗАГЛУШКА: здесь будет fetch() на CRM/Telegram-бота/почту.
       Сейчас заявка никуда не отправляется — показываем подтверждение. */

    form.hidden = true;
    successText.textContent =
      'Спасибо, ' + name + '! Перезвоним на ' + phone + ' в течение 15 минут в рабочее время.';
    successBox.hidden = false;
    successBox.focus();
  });
})();
