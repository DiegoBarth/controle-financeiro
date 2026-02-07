import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'
import { EDGE_ZONE, SWIPE_DELTA_PX, SWIPE_MIN_DISTANCE_PX, SWIPE_ROUTES } from '@/config/constants'

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

         if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > SWIPE_MIN_DISTANCE_PX && iniciouNaEsquerda && indexAtual > 0) {
               setArrow('left')
               return
            }

            if (e.deltaX < -SWIPE_MIN_DISTANCE_PX && iniciouNaDireita && indexAtual < SWIPE_ROUTES.length - 1) {
               setArrow('right')
               return
            }
         }

         if (e.deltaY > SWIPE_MIN_DISTANCE_PX  && window.scrollY === 0) {
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
      delta: SWIPE_DELTA_PX,
   })

   return { handlers, arrow }
}
