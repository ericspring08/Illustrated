import { type NextPage } from "next";
import Head from "next/head";
import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { jsPDF } from "jspdf"
import { toPng } from "html-to-image"
import Modal from "./_modal";
// eslint-disable

const Home: NextPage = () => {
  const [words, setWords] = useState("")
  const [pdfFile, setPdfFile] = useState<any>()
  const [error, setError] = useState<boolean>(false)
  const pdfRef = useRef<HTMLDivElement>(null)
  
  const [render, setRender] = useState([""]);
  const getWordData = (words: string) => {
    axios({method: "POST", url: "https://illustratedbackend.up.railway.app/processword", data: { 'words': words }}).then((res) => {
      setRender(res.data);
    })
  }

  const generateImage = async () => {
    const image = await toPng(pdfRef.current!, { quality: 0.95 });
    const doc = new jsPDF();
    doc.addImage(image, 'JPEG', 5, 22, 200, 160);
    doc.save("book.pdf");
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
          <h1 className="text-5xl mt-[50px] font-monospace">Illustrated</h1>
          <textarea value={words} placeholder="Type Here" className="textarea textarea-bordered mt-[50px] w-[80%] h-1/2" autoComplete="false" onChange={(e) => {
            setWords(e.target.value)
          }}></textarea>
          <div className="mt-10 w-[80%]">
            <label className="btn btn-primary mr-[1%] w-[49%]" htmlFor="fileUpload">upload pdf</label>
            <button className="btn btn-secondary ml-[1%] w-[49%]">scan book</button>
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
                    console.log(element)
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
