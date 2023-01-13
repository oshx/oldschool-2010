import './stylesheets/main.scss';
import $ from 'jquery';
import attachPlugIn from './plugins/attach-plugin';

console.log('jQuery', $)

attachPlugIn

var $screen = $('#screen'),
  $signUp = ($screen.signUp = $pick('sign_up')),
  $signIn = ($screen.signIn = $pick('sign_in')),
  $home = ($screen.home = $pick('home')),
  $header = ($screen.header = $pick('header')),
  $footer = ($screen.footer = $pick('footer')),
  $message = ($screen.message = $pick('message', false))

var validator = {
  name: function nameValidator(value) {
    return validator._string(value) && validator._word(value)
  },
  email: function emailValidator(value) {
    return validator._string(value) && validator._emailFormat(value)
  },
  id: function idValidator(value) {
    return validator._string(value) && /[a-zA-Z]\w+/.test(value)
  },
  password: function passwordValidator(value) {
    return validator._string(value)
  },
  _string: function checkString(value) {
    return value && typeof value === 'string'
  },
  _word: function checkWord(value) {
    return /^(\w|[가-힣])+$/.test(value)
  },
  _emailFormat: function checkCompleteEmail(value) {
    return /^\w\@(\w\.)+\w$/.test(value)
  },
}

function main() {
  // process main start
  watchHash()
  return renderSignIn()
  // process main end
}

function renderSignIn() {
  return $screen.render('signIn')
}

function renderHome() {
  return $screen.render('home')
}

function renderSignOut() {
  return $screen.render('signIn')
}

function renderSignUp() {
  return $screen.render('signUp')
}

function signUp(name, email, id, password, retry) {
  if (!validator.name(name)) {
    return $screen.message('올바른 이름을 입력하세요.', name)
  }
  if (!validator.email(email)) {
    return $screen.message('올바른 전자우편을 입력하세요.', email)
  }
  if (!validator.id(id)) {
    return $screen.message('올바른 ID를 입력하세요.', id)
  }
  if (!validator.password(password)) {
    return $screen.message('올바른 암호를 입력하세요.', password)
  }
  if (password !== retry) {
    return $screen.message('암호를 똑같이 암호 확인란에 입력하세요.', retry)
  }
  save({})
  return renderSignIn()
}

function signIn(id, password) {
  if (!validator.id(id)) {
    return $screen.message('올바른 ID를 입력하세요.', id)
  }
  if (!validator.password(password)) {
    return $screen.message('올바른 암호를 입력하세요.', password)
  }
  return renderHome()
}

function signOut() {
  return renderSignIn()
}

function save(key, value) {
  if (typeof key !== 'string') {
    return
  }
  key = key || ''
  value = value || ''
  if (!key) {
    return
  }
  window.document.cookie = [
    'key=' + key,
    'value=' + JSON.stringify(value),
  ].join(';')
}

function load(key) {
  if (typeof key !== 'string') {
    return null
  }
  var cookie = window.document.cookie || ''
  var cookieList = cookie.split(';')
  var cookieMap = {}
  for (var i = 0; i < cookieList.length; i++) {
    var item = cookieList[i].split('=')
    cookieMap[item[0]] = item[1]
  }
  return cookieMap[key] || null
}

function $pick(id, isId) {
  var selector = '#_template_' + id + '._template',
    $parent = $(selector),
    $target = $($parent.get(0).innerText),
    className = 'screen'
  if (isId === false) {
    className = id
    id = undefined
  }
  $target.attr({
    id: id,
    class: className,
  })
  $parent.remove()
  $parent = null
  $target.message = $screen.message
  return $target
}

function watchHash() {
  $(window).on('hashchange', function watchHash() {
    console.log('changed!', this)
  })
}

function prevent(targetEvent) {
  if (targetEvent && targetEvent.preventDefault) {
    targetEvent.preventDefault()
  }
  return targetEvent
}

function removeCallback() {
  return $(this).remove()
}

/**
 * ==========================================
 * Event Binders
 * ==========================================
 */

$signUp.bindEvent = function bindSingUpEvent() {
  var $this = $screen.find('#sign_up'),
    $name = $this.name('name'),
    $email = $this.name('email'),
    $id = $this.name('id'),
    $password = $this.name('new-password'),
    $passwordRetry = $this.name('new-password-retry')
  $this.submit(function submitSignUp(submitEvent) {
    prevent(submitEvent)
    var name = $name.val(),
      email = $email.val(),
      id = $id.val(),
      password = $password.val(),
      retry = $passwordRetry.val()
    return signUp(name, email, id, password, retry)
  })
  return $signUp
}.bind($signUp)

$signIn.bindEvent = function bindSignInEvent() {
  var $this = $screen.find('#sign_in'),
    $id = $this.name('id'),
    $password = $this.name('current-password'),
    $signUp = $this.name('sign-up')
  $this.submit(function submitSignIn(submitEvent) {
    prevent(submitEvent)
    var id = $id.val(),
      password = $password.val()
    return signIn(id, password)
  })
  $signUp.click(function clickSignUp(clickEvent) {
    if (clickEvent && clickEvent.preventDefault) {
      clickEvent.preventDefault
    }
    return renderSignUp()
  })
  console.log(load('test'))
  console.log(save('test', 1))
  console.log(load('test'))
  return $signIn
}.bind($signIn)

$home.bindEvent = function bindHomeEvent() {
  var $this = $screen.find('#home'),
    $signOut = $this.name('sign-out')
  $this.submit(function submitSignOut(submitEvent) {
    prevent(submitEvent)
    return renderSignIn()
  })
}.bind($home)

/**
 * ==========================================
 * Screen Functions
 * ==========================================
 */
$screen.MESSAGE_TIMER = 1
$screen.message = function renderMessage(message, option) {
  var $this = this
  console.debug('[DEBUG](message)', message, '\n"', option, '"')
  $message
    .clone(true, true)
    .hide()
    .html(message)
    .prependTo($this.find('.message-rack'))
    .fadeIn(30)
    .delay(this.MESSAGE_TIMER * 1000)
    .fadeOut(removeCallback)
  return this
}.bind($screen)

$screen.attach = function attach() {
  this.prepend(this.header).append(this.footer)
  return this
}.bind($screen)

$screen.render = function render(target) {
  if (!target || typeof target !== 'string') {
    return this
  }
  var $target = $screen[target]
  if (!$target.length) {
    return $target
  }
  this.html($target.clone())
  if ($target.bindEvent) {
    $target.bindEvent()
  }
  if ($target.action) {
    window.location.hash = $target.action
  }
  return this.attach();
}.bind($screen);

main();
