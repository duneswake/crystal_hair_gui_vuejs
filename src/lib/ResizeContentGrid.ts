import { storeToRefs } from 'pinia'

import { GlobalStore } from '@/services/GlobalStore'
import { useKernalStore } from '@/services/api/KernalStore'

import type { kernalType } from '@/assets/types/ApiTypes'

function resizeContentFit () {
  const el = document.getElementById('app')
  const cgb_width = GlobalStore().cgbWidth
  const cgb = document.querySelector('.cgb-0')
  let cgb_margin = 5
  let scroll_width = 5
  let min_pane_left =(window.innerWidth < 400) ? 146 : 203
  if (cgb != null) {
    const width  = window.getComputedStyle(cgb).marginRight
    cgb_margin = Number(width.substring(0, width.length - 2))
  }
  if ( el != null) {
    if (GlobalStore().paneSize === 30 ){
      const max_cont_width = el.offsetWidth - min_pane_left - scroll_width - (cgb_margin)
      const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 13
      const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
      const content_width_percent = (max_cont_width) / el.offsetWidth
      const offset_size = ((-1 * (content_width_percent - 1)) - .3) * 100
      GlobalStore().paneSizeOffSet =(offset_size)
      GlobalStore().setCgbWidthSized(GlobalStore().cgbWidth + (extra_width / Math.trunc(tt)))
      resizeSrc()
    }
    if (GlobalStore().paneSize === 0 ){
      const max_cont_width = el.offsetWidth - scroll_width - (cgb_margin + 7)
      const extra_width = max_cont_width % (cgb_width + (cgb_margin))
      const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
      GlobalStore().setCgbWidthSized(GlobalStore().cgbWidth + (extra_width / Math.trunc(tt)))
      resizeSrc()
    }
  }
}

function stepContentFit (step: number) {
  const el = document.getElementById('app')
  const cgb_width = GlobalStore().cgbWidth
  let cgb_margin =  5
  let scroll_width = 5
  let min_pane_left =(window.innerWidth < 400) ? 146 : 203
  if ( el != null) {
    const max_cont_width = el.offsetWidth - min_pane_left - scroll_width - (cgb_margin) - 20
    const extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 18
    const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
    if(step + Math.trunc(tt) >= 1){
      const fitWidth = (max_cont_width - (step + Math.trunc(tt)) * cgb_margin) / (step + Math.trunc(tt))
      GlobalStore().cgbWidth = fitWidth - (GlobalStore().cgbWidthSized - GlobalStore().cgbWidth)
      GlobalStore().cgbWidthSized = fitWidth
      resizeContentFit()
      resizeSrc()
    }
  }
}

function resize (size: number) {
  if (GlobalStore().paneSize !== size) {
    GlobalStore().paneSizeTemp = GlobalStore().paneSize
    GlobalStore().paneSize = size
    GlobalStore().paneSizeOffSet = 0
  } else { GlobalStore().paneSize = GlobalStore().paneSizeTemp }
  resizeContentFit()
}

// SRCSET IMAGE SELECTION ACCORDING TO CARD SIZE
function setSize (k: kernalType) {
  const images = <HTMLCollectionOf<HTMLDivElement>> document.getElementsByClassName('cgb-0');
  if (images[0] !== undefined) {
    const width = images[0].offsetWidth
    if (width > 160 && width <= 400){
      return k.signed_url_m;
    } else if (width > 400 && width <= 1000){
      return k.signed_url_l;
    } else if (width > 1000) {
      return k.signed_url;
    } else {
      return k.signed_url_s;
    }
  }
}
function resizeSrc() {
  const images = <HTMLCollectionOf<HTMLImageElement>> document.getElementsByClassName('thumbnail');
  const { kernals } = storeToRefs(useKernalStore())
  if (images[0] !== undefined && images[0].parentElement !== null) {
    const width = images[0].offsetWidth
    for(let i = 0; i < images.length; i++) {
      const f: number = kernals.value.findIndex(x => x.id === images[i].id)
      if (width > 160 && width <= 400){
        images[i].setAttribute('src', kernals.value[f].signed_url_m);
      } else if (width > 400 && width <= 1000){
        images[i].setAttribute('src', kernals.value[f].signed_url_l);
      } else if (width > 1000) {
        images[i].setAttribute('src', kernals.value[f].signed_url_l);
      } else {
        images[i].setAttribute('src', kernals.value[f].signed_url_s);
      }
    }
  }
}
export { resize, setSize, stepContentFit, resizeContentFit }
