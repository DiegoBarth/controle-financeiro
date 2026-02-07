import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'
import { SWIPE_ROUTES, EDGE_ZONE } from '@/config/constants'

export function useSwipeNavigation() {
   const navigate = useNavigate()
   const location = useLocation()
   const [arrow, setArrow] = useState<'left' | 'right' | 'up' | null>(null)

   const indexAtual = SWIPE_ROUTES.indexOf(location.pathname)

   const handlers = useSwipeable({
      onSwiping: (e) => {
         const larguraTela = window.innerWidth

         const iniciouNaEsquerda = e.initial[0] < EDGE_ZONE
         const iniciouNaDireita = e.initial[0] > larguraTela - EDGE_ZONE

         // --- Horizontal ---
         if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 50 && iniciouNaEsquerda && indexAtual > 0) {
               setArrow('left')
               return
            }

            if (e.deltaX < -50 && iniciouNaDireita && indexAtual < SWIPE_ROUTES.length - 1) {
               setArrow('right')
               return
            }
         }

         // --- Vertical (pull to refresh) ---
         if (e.deltaY > 50 && window.scrollY === 0) {
            setArrow('up')
         } else if (arrow === 'up') {
            setArrow(null)
         }
      },

      onSwipedLeft: (e) => {
         setArrow(null)
         const iniciouNaDireita = e.initial[0] > window.innerWidth - EDGE_ZONE
         if (iniciouNaDireita && indexAtual < SWIPE_ROUTES.length - 1) {
            navigate(SWIPE_ROUTES[indexAtual + 1])
         }
      },

      onSwipedRight: (e) => {
         setArrow(null)
         const iniciouNaEsquerda = e.initial[0] < EDGE_ZONE
         if (iniciouNaEsquerda && indexAtual > 0) {
            navigate(SWIPE_ROUTES[indexAtual - 1])
         }
      },

      onSwipedDown: () => {
         if (window.scrollY === 0) {
            setArrow(null)
            window.location.reload()
         }
      },

      onTouchEndOrOnMouseUp: () => setArrow(null),
      preventScrollOnSwipe: true,
      trackMouse: true,
      delta: 10,
   })

   return { handlers, arrow }
}
