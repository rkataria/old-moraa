import { NextResponse } from "next/server";
import path from 'path'
import { headers } from 'next/headers';

import PPTXCompose from "@advisr/pptx-compose-2";
const composer = new PPTXCompose();
export async function POST(request: Request) {
  //@ts-ignore
  // const path = process.pwd() + '/public/pptone.pptx';
  console.log(process.cwd())
  // const requestUrl = new URL(request.url)
  // const formData = await request.formData()
  // const file = String(formData.get("file"))
  // console.log('file', file)
  // const pptx = await composer.toJSON(filePath);
  // console.log("pptx", pptx);

  // return NextResponse.redirect(requestUrl.origin, {
  //   // a 301 status is required to redirect from a POST to a GET route
  //   status: 301,
  // })
  // return NextResponse.json({
  //   text: "hello world",
  // });
}
