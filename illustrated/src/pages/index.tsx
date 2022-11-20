import { type NextPage } from "next"; import Head from "next/head"; 
import axios from "axios" 
import { useState, useRef } from "react"
import { jsPDF } from "jspdf"
import { toPng } from "html-to-image"
import Modal from "./_modal";
// eslint-disable

const Home: NextPage = () => {
  const [words, setWords] = useState<any>("")
  const [file, setFile] = useState<any>()
  const [error, setError] = useState<boolean>(false)
  const pdfRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [render, setRender] = useState([""]);

  const getWordData = async(words: string) => {
    setIsProcessing(true)
    await axios({ method: "POST", url: "https://illustratedbackend.up.railway.app/processword", data: { 'words': words } }).then((res) => {
      setRender(res.data);
    })
    setIsProcessing(false)
  }

  const generateImage = async () => {
    const image = await toPng(pdfRef.current!, { quality: 1 });
    const doc = new jsPDF();
    doc.addImage(image, 'JPEG', 5, 22, 200, 160);
    doc.save("book.pdf");
  }

  return (
    <>
      <Head>
        <title>Illustrated</title>
        <meta name="description" content="Convert normal books into picture books" />
        <link rel="icon" href="/Illustrated-Logo.png" />
      </Head>
      <main>
        <div className="flex flex-col items-center h-screen w-screen">
          <h1 className="text-5xl mt-[50px] font-monospace font-bold">Illustrated</h1>
          <textarea value={words} placeholder="Type Here" className="textarea textarea-bordered mt-[50px] w-[80%] h-1/2" autoComplete="false" onChange={(e) => {
            setWords(e.target.value)
          }}></textarea>
          <div className="mt-10 w-[80%]">
            <label className="btn btn-secondary w-[100%]" htmlFor="textUpload">upload text file</label>
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
          <div className="w-screen h-screen flex flex-col items-center">
            <div ref={pdfRef} className="w-[90%]">
              <h3 className="font-bold text-5xl text-center mt-[20px]">Illustrated</h3>
              {
                isProcessing === true &&
                <div className="flex flex-col items-center mt-[20px]">
                  <div className="spinner"></div>
                  <p className="text-xl mt-[20px]">Processing...</p>
                </div>
              }
              {
                render.map((element, index) => {
                  if (element.includes("base64")) {
                    console.log(element)
                    return (
                      <img key={index} src={element} className="mt-[20px] mb-[20px]"></img>
                    )
                  } else {
                    return (
                      <p key={index} className="items-start">{element}</p>
                    )
                  }
                })
              }
            </div>
            <div className="modal-action w-[90%]">
              <label htmlFor="my-modal-3" className="btn text-white btn-info" onClick={() => {
                generateImage()
              }}>Download as PDF</label>
              <label htmlFor="my-modal-3" className="btn text-white btn-success">Convert New</label>
            </div>
          </div>
        </div>
        <Modal id="textUpload" title="Upload a .TXT File">
          <input type="file" accept=".txt" className="file-input file-input-bordered" onChange={(e) => {
            setFile(e.target.files)
          }}></input>
          <label className="btn" htmlFor="textUpload" onClick={() => {
            if (!file) {
              setError(true)
              setTimeout(() => {
                setError(false)
              }, 2000)
            } else {
              const reader = new FileReader()
              reader.readAsText(file[0])
              reader.onload = () => {
                setWords(reader.result)
              }
            }
          }}>Submit File</label>
        </Modal>
      </main>
    </>
  );
};

export default Home;
