declare const menuData: {
  menu: {
    categories: Array<{
      id: string
      ja_name: string
      thai_name: string
      name: string
      items: Array<{
        id: string
        ja_name: string
        thai_name: string
        name: string
        description?: string
        price: number
      }>
    }>
  }
}

export { menuData }

