;(function () {
  'use strict'

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.getElementById('nav-toggle')
  const nav = document.getElementById('site-nav')

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open')

      toggle.setAttribute('aria-expanded', String(isOpen))
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú')
    })

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open')
        toggle.setAttribute('aria-expanded', 'false')
        toggle.setAttribute('aria-label', 'Abrir menú')
      })
    })
  }

  /* --------- button to top ---------- */
  const backToTop = document.getElementById('back-to-top')

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 400)
    })

    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()

  /* ---------- business hours ---------- */
  // Lunes a viernes, 8:00 a.m. – 6:00 p.m. Sábado y domingo cerrado.
  const OPEN_HOUR = 8
  const CLOSE_HOUR = 18

  function getVeracruzTime() {
    const now = new Date()

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Mexico_City',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(now)

    const values = {}

    parts.forEach(function (part) {
      if (part.type !== 'literal') {
        values[part.type] = part.value
      }
    })

    const days = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    }

    return {
      day: days[values.weekday],
      hour: Number(values.hour),
      minute: Number(values.minute),
    }
  }

  function updateStatus() {
    const now = getVeracruzTime()

    const hour = now.hour + now.minute / 60
    const isWeekday = now.day >= 1 && now.day <= 5
    const open = isWeekday && hour >= OPEN_HOUR && hour < CLOSE_HOUR

    const pairs = [
      ['status-dot', 'status-text'],
      ['status-dot-2', 'status-text-2'],
    ]

    pairs.forEach(function (ids) {
      const dot = document.getElementById(ids[0])
      const text = document.getElementById(ids[1])
      if (!dot || !text) return

      dot.classList.remove('open', 'closed')
      dot.classList.add(open ? 'open' : 'closed')
      text.textContent = open
        ? 'Abierto ahora · cierra 6:00 p. m.'
        : 'Cerrado ahora'
    })

    // resalta el día de hoy en la tabla de horario
    const today = now.day
    document.querySelectorAll('#schedule-table tr').forEach(function (row) {
      const isToday = row.getAttribute('data-day') === String(today)
      row.classList.toggle('is-today', isToday)
    })
  }

  updateStatus()
  // vuelve a comprobar cada minuto por si el horario cambia mientras la página está abierta
  setInterval(updateStatus, 60 * 1000)
})()
