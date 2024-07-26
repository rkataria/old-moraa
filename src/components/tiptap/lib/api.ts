export class API {
  public static uploadImage = async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 500))

    return '/placeholder-image.jpg'
  }
}

// eslint-disable-next-line import/no-default-export
export default API
