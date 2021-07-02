export default interface GamePassProduct {
  id: string,
  developer: string,
  title: string,
  img: string,
  category: string,
  platforms: string[],
  duration?: Number
}