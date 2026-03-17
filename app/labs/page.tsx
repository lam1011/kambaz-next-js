import Link from "next/link";
export default function labs() {
 return (
   <div id="wd-labs">
     <h1>Labs</h1>
     <ul>
      <div>
        John Vincent Perez
      </div>
       <li>
         <Link href="/labs/lab1" id="wd-lab1-link">
           Lab 1: HTML Examples </Link>
       </li>
       <li>
         <Link href="/labs/lab2" id="wd-lab2-link">
           Lab 2: CSS Basics </Link>
       </li>
       <li>
         <Link href="/labs/lab3" id="wd-lab3-link">
           Lab 3: JavaScript Fundamentals </Link>
       </li>
       <li>
         <Link href="https://github.com/lam1011/kambaz-next-js/tree/a2" id="wd-github">
           Github repo link </Link>
       </li>
       <li> 
        <Link href="/labs/lab4" id="wd-lab4-link">
          Lab 4: Maintaining State in React Applications </Link>
       </li>
     </ul>
   </div>
);}

