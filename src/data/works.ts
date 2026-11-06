export interface Work {
  src: string
  title: string
  material: string
  /** portrait photos get a taller tile */
  portrait: boolean
}

/** Fotografije radova preuzete s Instagram profila @impalaklesarstvo. */
export const works: Work[] = [
  { src: '/radovi/rad-01.jpg', title: 'Spomenik s klesanom ružom i anđelom', material: 'Bianco Sardo', portrait: false },
  { src: '/radovi/rad-02.jpg', title: 'Obiteljska grobnica s tri ploče', material: 'Nero Assoluto · Imperial Red', portrait: false },
  { src: '/radovi/rad-03.jpg', title: 'Spomenik u obliku vala', material: 'Multicolor Red', portrait: true },
  { src: '/radovi/rad-04.jpg', title: 'Spomenik s anđelom od bijelog mramora', material: 'Bianco Sardo · Bianco Carrara', portrait: true },
  { src: '/radovi/rad-05.jpg', title: 'Dvostruki spomenik s pokrovnim pločama', material: 'Steel Grey', portrait: true },
  { src: '/radovi/rad-06.jpg', title: 'Spomenik srce s ružom i vazama', material: 'Multicolor Red', portrait: true },
  { src: '/radovi/rad-07.jpg', title: 'Spomenik s graviranim portretom', material: 'Nero Assoluto', portrait: true },
  { src: '/radovi/rad-08.jpg', title: 'Spomenik srce s ružom', material: 'Nero Assoluto · postolje Vizag Blue', portrait: true },
  { src: '/radovi/rad-09.jpg', title: 'Obiteljski spomenik sa zlatnim slovima', material: 'Impala · postolje Bianco Sardo', portrait: true },
  { src: '/radovi/rad-10.jpg', title: 'Spomenik srce s klesanom ružom', material: 'Rosa Beta', portrait: true },
]
