'use server'
 
import PPTXCompose from "@advisr/pptx-compose-2";
const composer = new PPTXCompose();

export async function createUser(request: Request) {
  const pptx = await composer.toJSON("/pptone.pptx");
  console.log("pptx", pptx);


  return {
    message: 'Please enter a valid email',
  }
}
