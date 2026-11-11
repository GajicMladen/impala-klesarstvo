export interface Work {
  src: string
  title: string
  material: string
  /** portrait photos get a taller tile */
  portrait: boolean
}

/**
 * Fotografije radova: rad-01 – rad-10 s Instagram profila @impalaklesarstvo, rad-11 i rad-12 dostavila radionica.
 * Naziv kamena navodimo samo gdje odgovara materijalu iz kataloga; inače opisno.
 */
export const works: Work[] = [
  { src: '/radovi/rad-11.jpg', title: 'Unutarnje stubište od granita', material: 'Crni granit · gazišta i čela', portrait: true },
  { src: '/radovi/rad-12.jpg', title: 'Zakrivljeni šank od poliranog granita', material: 'Tamni granit · šank i obloga stupova', portrait: true },
  { src: '/radovi/rad-01.jpg', title: 'Spomenik s klesanom ružom i anđelom', material: 'Bianco Sardo', portrait: false },
  { src: '/radovi/rad-02.jpg', title: 'Obiteljska grobnica s tri ploče', material: 'Crni i crveni granit', portrait: false },
  { src: '/radovi/rad-03.jpg', title: 'Spomenik u obliku vala', material: 'Multicolor', portrait: true },
  { src: '/radovi/rad-04.jpg', title: 'Spomenik s anđelom od bijelog mramora', material: 'Bianco Sardo · anđeo od mramora', portrait: true },
  { src: '/radovi/rad-05.jpg', title: 'Dvostruki spomenik s pokrovnim pločama', material: 'Sivi granit', portrait: true },
  { src: '/radovi/rad-06.jpg', title: 'Spomenik srce s ružom i vazama', material: 'Multicolor', portrait: true },
  { src: '/radovi/rad-07.jpg', title: 'Spomenik s graviranim portretom', material: 'Crni granit', portrait: true },
  { src: '/radovi/rad-08.jpg', title: 'Spomenik srce s ružom', material: 'Crni granit · svijetlo postolje', portrait: true },
  { src: '/radovi/rad-09.jpg', title: 'Obiteljski spomenik sa zlatnim slovima', material: 'Impala · postolje Bianco Sardo', portrait: true },
  { src: '/radovi/rad-10.jpg', title: 'Spomenik srce s klesanom ružom', material: 'Rosa Beta', portrait: true },
]
