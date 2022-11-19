import { type NextPage } from "next";
import Head from "next/head";
import axios from "axios"
import { useState, useRef } from "react"
import { jsPDF } from "jspdf"
import { toPng } from "html-to-image"
import Modal from "./_modal";
// eslint-disable

const Home: NextPage = () => {
  const [words, setWords] = useState("")
  const [pdfFile, setPdfFile] = useState<any>()
  const [error, setError] = useState<boolean>(false)
  const pdfRef = useRef<HTMLDivElement>(null)
  const mockData: Array<string> = [
    "string",
    "data:image/png;base64,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",
    "string",
  ]
  const [render, setRender] = useState([""]);
  const getWordData = (words: string) => {
    //axios.post("", { text: words }).then((res) => {
    //})
    setRender(mockData)
  }

  const generateImage = async () => {
    const image = await toPng(pdfRef.current!, { quality: 0.95 });
    const doc = new jsPDF();
    doc.addImage(image, 'JPEG', 5, 22, 200, 160);
    doc.save("hi.pdf");
  }

  return (
    <>
      <Head>
        <title>Illustrated</title>
        <meta name="description" content="Convert normal books into picture books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col items-center h-screen w-screen">
          <h1 className="text-5xl mt-[50px]">Illustrated</h1>
          <textarea value={words} placeholder="Type Here" className="textarea textarea-bordered mt-[50px] w-[80%] h-1/2" autoComplete="false" onChange={(e) => {
            setWords(e.target.value)
          }}></textarea>
          <div className="mt-10 w-[80%]">
            <label className="btn btn-primary mr-[1%] w-[49%]" htmlFor="fileUpload">upload pdf</label>
            <button className="btn btn-secondary ml-[1%] w-[49%]" onClick={() => {

            }}>scan book</button>
          </div>
          <label className="btn btn-error text-white mt-2 w-[80%]" htmlFor="my-modal-3" onClick={() => {
            getWordData(words)
          }}>Convert</label>
          <div className={error ? "alert alert-error shadow-lg mt-[20px] w-[80%]" : "hidden"}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Error! Task failed successfully.</span>
            </div>
          </div>
        </div>
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal bg-white w-screen h-screen overflow-auto">
          <div className="w-screen h-screen flex flex-col items-start ml-[2%]">
            <div ref={pdfRef}>
              <h3 className="font-bold text-5xl text-center mt-[20px]">Book Thing</h3>
              {
                render.map((element, index) => {
                  if (element.includes("base64")) {
                    return (
                      <img key={index} src={element}></img>
                    )
                  } else {
                    return (
                      <p key={index}>{element}</p>
                    )
                  }
                })
              }
            </div>
            <div className="modal-action">
              <label htmlFor="my-modal-3" className="btn" onClick={() => {
                generateImage()
              }}>Download as PDF</label>
            </div>
          </div>
        </div>
        <Modal id="fileUpload" title="Upload a PDF File">
          <input type="file" accept=".pdf" className="file-input file-input-bordered" onChange={(e) => {
            setPdfFile(e.target.files)
          }}></input>
          <label className="btn" htmlFor="fileUpload" onClick={() => {
            if (!pdfFile) {
              setError(true)
              setTimeout(() => {
                setError(false)
              }, 2000)
            } else {
              
            }
          }}>Submit File</label>
        </Modal>
      </main>
    </>
  );
};

export default Home;
