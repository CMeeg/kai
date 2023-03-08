const projectDataCenterLocation = {
  australia: 'australia',
  eastUs: 'eastUs',
  netherlands: 'netherlands'
} as const

type ProjectDataCenterLocation =
  (typeof projectDataCenterLocation)[keyof typeof projectDataCenterLocation]

const defaultProjectDataCenterLocation = projectDataCenterLocation.eastUs

export { projectDataCenterLocation, defaultProjectDataCenterLocation }

export type { ProjectDataCenterLocation }
