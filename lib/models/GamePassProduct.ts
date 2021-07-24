export default interface GamePassProduct {
  id: string,
  title: string,
  img?: string,
  category: string,
  platforms: string[],
  duration?: Number,
  startDate?: string,
  linkTitle: string,
  comingSoonPC?: boolean
  leavingSoonPC?: boolean
  comingSoonConsole?: boolean
  leavingSoonConsole?: boolean
}