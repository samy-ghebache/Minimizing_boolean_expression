var tPremier = [];
var tGroupe = [];

function prec(c) {
  if (c == "*") return 3;
  else if (c == ".") return 2;
  else if (c == "+") return 1;
  else return -1;
}
function infixToPostfix(s) {
  let st = []; //For stack operations, we are using C++ built in stack
  let result = "";

  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    // If the scanned character is
    // an operand, add it to output string.
    if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
      result += c;
      if (i + 1 < s.length && s[i + 1] == "'") {
        result += "'";
        i++;
      }
    }
    // If the scanned character is an
    // ‘(‘, push it to the stack.
    else if (c == "(") st.push("(");
    // If the scanned character is an ‘)’,
    // pop and to output string from the stack
    // until an ‘(‘ is encountered.
    else if (c == ")") {
      while (st[st.length - 1] != "(") {
        result += st[st.length - 1];
        st.pop();
      }
      st.pop();
    }
    //If an operator is scanned
    else {
      while (st.length != 0 && prec(s[i]) <= prec(st[st.length - 1])) {
        result += st[st.length - 1];
        st.pop();
      }
      st.push(c);
    }
  }
  // Pop all the remaining elements from the stack
  while (st.length != 0) {
    result += st[st.length - 1];
    st.pop();
  }
  return result;
}
function OR(ch1, ch2) {
  return ch1 + "+" + ch2;
}
function AND(ch1, ch2) {
  let tab1 = [];
  let tab2 = [];
  let Expression = "";
  let minterm = "";
  for (let i = 0; i < ch1.length; i++) {
    if (ch1[i] != "+") {
      minterm = minterm + ch1[i];
    } else {
      tab1.push(minterm);
      minterm = "";
    }
  }
  tab1.push(minterm);
  minterm = "";
  for (let i = 0; i < ch2.length; i++) {
    if (ch2[i] != "+") {
      minterm = minterm + ch2[i];
    } else {
      tab2.push(minterm);
      minterm = "";
    }
  }
  tab2.push(minterm);
  for (let i = 0; i < tab1.length; i++) {
    for (let j = 0; j < tab2.length; j++) {
      Expression = Expression + tab1[i] + "." + tab2[j];
      if (!(i + 1 >= tab1.length && j + 1 >= tab2.length)) Expression += "+";
    }
  }
  return Expression;
}
function HASH(ch1) {
  //To remove duplicates in a minterms A.B.C.D.A-->A.B.C.D
  //Exemple :A.B.A.C.D.A-->A.B.C.D
  tab1 = [];
  tab1.length = 26;
  let result = "";
  for (let i = 0; i < ch1.length; i++) {
    if (isOperand(ch1[i])) {
      let indice = ch1[i].charCodeAt() - "A".charCodeAt();
      if (tab1[indice] == 1) {
        if (i + 1 < ch1.length && ch1[i + 1] == "'") return "";
      }
      if (tab1[indice] == -1) {
        if ((i + 1 < ch1.length && ch1[i + 1] != "'") || i + 1 >= ch1.length)
          return "";
      }
      tab1[indice] = 1;
      if (i + 1 < ch1.length && ch1[i + 1] == "'") tab1[indice] = -1;
    }
  }
  for (let i = 0; i < tab1.length; i++) {
    if (tab1[i] == 1 || tab1[i] == -1) {
      result += String.fromCharCode("A".charCodeAt() + i);
      if (tab1[i] == -1) result += "'";
      result += ".";
    }
  }
  return result.slice(0, result.length - 1);
}
function isOperand(x) {
  return (x >= "a" && x <= "z") || (x >= "A" && x <= "Z");
}
function OPERATION(operand1, operand2, ch) {
  if (ch == "+") {
    return OR(operand1, operand2);
  }
  if (ch == ".") {
    return AND(operand1, operand2);
  }
}
function getInfix(exp) {
  let s = [];

  for (let i = 0; i < exp.length; i++) {
    // Push operands
    if (isOperand(exp[i])) {
      let ch = "";
      ch = exp[i];
      if (i + 1 < exp.length) {
        if (exp[i + 1] == "'") {
          ch += "'";
          i++;
        }
      }
      s.push(ch);
    }
    // We assume that input is
    // a valid postfix and expect
    // an operator.
    else {
      let op1;
      op1 = s.pop();
      if (exp[i] != "*") {
        let op2 = s.pop();
        s.push(OPERATION(op2, op1, exp[i]));
      } else s.push(Not(op1));
    }
  }
  // There must be a single element
  // in stack now which is the required
  // infix.
  return s[s.length - 1];
}
function Not(expression) {
  //Provide the negation of an expression
  let ch = "(";
  for (let i = 0; i < expression.length; i++) {
    if (isOperand(expression[i])) {
      ch += expression[i];
      if (i + 1 < expression.length) {
        if (expression[i + 1] != "'") {
          ch += "'";
        }
      } else ch += "'";
    } else {
      if (expression[i] == "+") ch += ")" + "." + "(";
      else if (expression[i] == ".") ch += "+";
    }
  }
  ch += ")";
  ch = infixToPostfix(ch);
  ch = getInfix(ch);
  return ch;
}
function Disjonctive(expression) {
  let expr = "";
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] == ")") {
      expr += expression[i];
      if (i + 1 < expression.length && expression[i + 1] == "'") {
        expr += "*";
        i++;
      }
    } else expr += expression[i];
  }
  expr = infixToPostfix(expr);
  expr = getInfix(expr);
  return expr;
}
function splitt(exp) {
  let tab = [];
  let conc = "";
  for (let i = 0; i < exp.length; i++) {
    let element = exp[i];
    conc += element;
    if (element === "+") {
      conc = conc.slice(0, -1);
      tab.push(conc);
      conc = "";
    }
  }
  tab.push(conc);
  return tab;
}
function hashExpression(tab) {
  let tab2 = [];
  let a;
  for (let i = 0; i < tab.length; i++) {
    a = HASH(tab[i]);
    if (a !== "") {
      tab2.push(HASH(tab[i]));
    }
  }
  return tab2;
}
function theHash(exp) {
  let tab = splitt(exp);
  tab = hashExpression(tab);
  let text = tab.join("+");
  return text;
}
function disjonctiveTransform(exp) {
  exp = Disjonctive(exp);
  let expr = theHash(exp);
  expr = expr.split(".");
  expr = expr.join("");
  return expr;
}

// function extracteIndices(minterm) {
//   var LesIndicesImp = ""; // var qui contient les indices de chaque minterme.
//   var listeDeMintermeWithoutApostroph = allVariables(minterm);
//   for (var k in listeDeMintermeWithoutApostroph) {
//     LesIndicesImp += TempContientTouteVariables.indexOf(
//       listeDeMintermeWithoutApostroph[k]
//     );
//   }
//   return LesIndicesImp;
// }
// function comparaison(binOriginal, indices, generatedBin) {
//   console.log(
//     "binoriginal + " + binOriginal + " " + " indices " + indices + ""
//   );
//   var listeDesIndices = indices.split("");
//   var rien = 0;
//   for (var k = 0; k < listeDesIndices.length; k++) {
//     listeDesIndices;
//     console.log(
//       "k " +
//         k +
//         " + listedesindice.lenght " +
//         listeDesIndices.length +
//         " binoriginal + "
//     );
//     console.log(binOriginal[Number(listeDesIndices[k])]);
//     rien = binOriginal[Number(listeDesIndices[k])];
//     rien = generatedBin[Number(listeDesIndices[k])];
//     rien;

//     if (
//       binOriginal[Number(listeDesIndices[k])] !=
//       generatedBin[Number(listeDesIndices[k])]
//     ) {
//       return false;
//     } else {
//     }
//   }
//   return true;
// }
// function finalBoss(arrayDesBinaires) {
//   var IterMinterme = "b'cd";
//   var iterbinaireMin;
//   var iterIndices;
//   var iterBinaireNum;
//   for (var m = 0; m < tabDesMintermes.length; m++) {
//     IterMinterme = tabDesMintermes[m];
//     iterbinaireMin = generateBinaire(IterMinterme);
//     iterIndices = extracteIndices(IterMinterme);

//     for (var i = 0; i <= Math.pow(2, NumberOfVars) - 1; i++) {
//       iterBinaireNum = i.toString(2);

//       while (iterBinaireNum.length < NumberOfVars) {
//         iterBinaireNum = "0" + iterBinaireNum;
//       }
//       console.log(
//         " iterbinaireMin, iterIndices, iterBinaireNum " +
//           iterbinaireMin +
//           " " +
//           iterIndices +
//           " " +
//           iterBinaireNum
//       );
//       if (comparaison(iterbinaireMin, iterIndices, iterBinaireNum)) {
//         arrayDesBinaires.push(iterBinaireNum);
//       } else {
//       }
//     } // boucle des i=0 jusque 2**n des canonical functs .
//   } // main boocle for : that goes once for each minterme .
// }
// function generateBinaire(minterme) {
//   //minterme = "a'bc'de'";
//   var listeMinterme = [];

//   var BinaryMintermeEnArray = new Array(NumberOfVars);
//   BinaryMintermeEnArray;

//   for (var g = 0; g < BinaryMintermeEnArray.length; g++) {
//     BinaryMintermeEnArray[g] = "0";
//   }

//   var BinaryMinterme;
//   BinaryMintermeEnArray;
//   listeMinterme = minterme.split("");
//   listeMinterme;
//   var index = 0;
//   var sortedARR;

//   for (var g = 0; g < listeMinterme.length; g++) {
//     if (listeMinterme[g] != "'") {
//       chhhh = listeMinterme[g];

//       TempContientTouteVariables;
//       sortedARR = TempContientTouteVariables.split("");
//       sortedARR = sortedARR.sort();
//       sortedARR;
//       TempContientTouteVariables = sortedARR.join("");
//       console.log(TempContientTouteVariables);
//       if (isLetter(listeMinterme[g]) && listeMinterme[g + 1] == "'") {
//         index = TempContientTouteVariables.indexOf(listeMinterme[g]);
//         index;
//         BinaryMintermeEnArray[index] = "0";
//       } else {
//         index = TempContientTouteVariables.indexOf(listeMinterme[g]);
//         index;
//         BinaryMintermeEnArray[index] = "1";
//       }
//     }
//   }
// }
// function removeSpaces(array) {
//   for (var i = 0; i < array.length; i++) {
//     array[i] = array[i].trim();
//   }
// }
// function allVariables(expression) {
//   var listDesChars = expression.split("");
//   var VarsInExp = [];
//   for (var i in listDesChars) {
//     if (isLetter(listDesChars[i]) && !VarsInExp.includes(listDesChars[i])) {
//       VarsInExp.push(listDesChars[i]);
//     }
//   }
//   return VarsInExp;
// }
// function isLetter(c) {
//   return c.toLowerCase() != c.toUpperCase();
// }

// start from here
// var expression = "a+b+i+j+k+l+v+Z+d+a+d+e+f+ab'cd'e+a'b'clmn'o'+ac'+bc'+ia'+ja'+kb'+ld'+db'c'+aZ'j'+j+k+l+v+Z+d+a+d+e+f+a+b+i+j+k+l+v+Z+d+a+d+e+f+ab'cd'e+a'b'clmn'o'+ac'+bc'+ia'+ja'+kb'+ld'+db'c'+aZ'j'+j+k+l+v+Z+d+a+d+e+f+a+b+i+j+k+l+v+Z+d+a+d+e+f+ab'cd'e+a'b'clmn'o'+ac'+bc'+ia'+ja'+kb'+ld'+db'c'+aZ'j'+j+k+l+v+Z+d+a+d+e+f+ab'cd'e+a'b'clmn'o'+ac'+bc'+ j'+k'+l'+v'+z'+d'+a'+d+e'+ab+ef+ abd +a'bd + a'b'c'd' + a'bc'd'e' + ef'a' + abg' + a'b'c'd'e'f + a'b'c'def' + e'f'g' + abc'd'e'fgi' + a'c'd'g'i' + abcdef'g'i + a'b'cde'gi'++ a'b'c'd'e'f + a'b'c'def' + e'f'g' + abc'd'e'fgi' + a'c'd'g'i' + abcdef'g'i + a'b'cde'gi' + asdf'd's' +a+b+c+d+e+f+af+ae+ab+av+e+fe+ge+g' +a+b+e+n'+n'm'ad'+g'+av'de's' + abd'+ad'e'+acdem'+adefgh'e + afgh' + afeacfg' +abfn+amne'+ cd'ef + aef'h' + z+az' + edfeaz' + efca'zdc' + ab'cezd'c'+ a'cb'ed'+bz'efg'";
// var expression ="AB+CD'+EF+GH'+I'J+K'L+M'N+O'P+AD+EF'+GO+HK+BJ'N+AGK+D+AP+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+H'JC+CFMN+AB'E+ABCDEFGHIJKLMNOP+qu+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'"
//var expression = " a+b+c+d+e+f+g+h+i+j+k+l+m+n+o";
// var expression ="A+B+C+D+E+F+G+H+I+J+K+L+M+N+O+P+AB'+CD'+EFG'+AEFG+EG+CDE+IJ'KL'+ABMN'"
// var expression="wA.B.C'.D'.E'.F'.G'.H.I'.J'.K.L.M'.N'.O'+A.B'.C'.D.E.F.G'.H.I'.J'.K.L.M.N.O'+A.B.C'.D'.E.F'.G'.H.I'.J.K'.L'.M'.N.O'+A.B.C.D'.E'.F'.G'.H'.I'.J.K.L'.M.N'.O+A.B'.C.D.E'.F'.G.H.I'.J'.K.L.M.N.O+A'.B.C.D'.E.F'.G'.H'.I.J'.K.L.M'.N'.O'+A.B'.C'.D.E.F'.G.H.I'.J'.K'.L'.M.N'.O+A.B.C'.D.E'.F'.G'.H.I.J'.K'.L.M.N.O'+A.B'.C'.D'.E.F.G'.H'.I'.J'.K'.L.M.N.O+A'.B.C.D.E.F.G.H.I.J'.K'.L.M.N.O'+A.B.C.D'.E'.F'.G.H.I.J'.K'.L.M.N.O+A.B'.C.D.E.F.G'.H'.I.J'.K'.L'.M'.N.O+A.B'.C'.D.E.F.G.H'.I.J.K'.L.M.N'.O'+A.B.C.D'.E'.F'.G'.H.I.J.K.L'.M'.N'.O+A'.B'.C.D'.E'.F.G'.H'.I.J.K.L'.M'.N'.O'+A'.B.C.D'.E.F.G.H.I.J.K.L'.M'.N.O'+A'.B.C.D.E.F.G'.H.I.J.K.L.M'.N.O+A.B.C'.D.E'.F'.G'.H'.I'.J'.K'.L.M.N.O'+A'.B'.C.D.E.F.G.H.I.J'.K.L.M.N'.O'+A.B'.C'.D'.E.F'.G'.H'.I.J.K.L'.M.N.O+A.B'.C.D.E.F.G'.H.I'.J'.K.L.M.N.O+A.B.C'.D.E'.F.G.H'.I.J.K'.L.M.N.O'+A'.B'.C.D'.E.F'.G'.H'.I.J'.K.L.M'.N.O'+A'.B'.C'.D.E.F.G'.H'.I'.J'.K.L'.M.N.O'+A.B.C'.D'.E'.F.G'.H.I'.J'.K.L'.M.N.O+A'.B.C.D.E'.F.G'.H.I'.J.K.L'.M.N.O'+A'.B'.C'.D'.E'.F.G'.H.I'.J'.K'.L.M.N.O+A'.B'.C.D'.E.F'.G'.H.I.J'.K'.L'.M'.N.O+A'.B.C'.D'.E'.F.G'.H.I.J.K'.L'.M'.N.O'+A.B.C.D.E.F'.G'.H'.I'.J.K.L'.M.N'.O'+A.B.C'.D'.E'.F.G'.H'.I.J.K'.L'.M.N.O+A.B.C'.D.E'.F.G'.H'.I.J'.K'.L'.M.N'.O+A.B.C'.D'.E'.F'.G.H'.I'.J.K.L.M'.N.O+A.B'.C.D'.E'.F.G'.H'.I.J'.K'.L'.M'.N'.O'+A'.B.C'.D.E.F'.G.H'.I.J'.K'.L'.M'.N'.O'+A'.B'.C.D'.E.F'.G.H.I.J.K'.L'.M'.N.O+A'.B'.C'.D'.E'.F'.G.H.I.J.K'.L'.M.N.O'+A'.B'.C'.D.E'.F.G'.H.I'.J.K'.L.M.N.O+A.B'.C'.D.E'.F.G.H'.I.J'.K'.L'.M'.N'.O'+A'.B'.C.D.E'.F.G.H.I'.J.K'.L.M.N'.O+A.B.C'.D'.E.F.G.H'.I.J'.K.L.M'.N'.O'+A'.B'.C.D.E.F.G'.H.I.J.K.L'.M'.N.O'+A.B'.C'.D.E.F.G'.H.I'.J.K'.L.M'.N'.O'+A.B.C.D'.E.F'.G.H.I.J.K'.L'.M'.N'.O+A'.B.C'.D'.E.F'.G.H'.I.J.K'.L'.M.N'.O'+A.B'.C.D'.E'.F.G'.H'.I'.J.K.L'.M.N.O+A'.B.C'.D'.E.F.G'.H.I.J.K'.L.M'.N.O'+A.B'.C'.D'.E.F'.G.H.I.J'.K.L'.M.N'.O+A.B'.C.D'.E'.F.G'.H'.I'.J.K.L'.M'.N.O'+A'.B'.C'.D.E'.F'.G.H'.I.J'.K.L.M.N'.O+A'.B'.C.D.E'.F'.G.H'.I'.J.K'.L.M'.N'.O'+A.B.C'.D'.E'.F.G'.H.I.J.K.L.M'.N'.O+A'.B'.C'.D.E'.F.G'.H'.I'.J'.K'.L.M.N'.O'+A.B.C'.D'.E'.F.G.H'.I.J.K.L.M.N'.O'+A.B'.C.D.E'.F'.G.H'.I.J.K'.L'.M'.N.O'+A.B.C.D'.E'.F'.G'.H.I.J'.K'.L'.M'.N'.O'+A'.B'.C'.D'.E.F'.G'.H'.I'.J'.K.L.M.N.O+A.B.C'.D'.E.F.G'.H'.I'.J.K.L.M.N.O+A.B.C'.D.E.F'.G.H.I'.J.K'.L'.M'.N.O+A'.B'.C.D'.E.F'.G.H'.I.J'.K'.L'.M.N'.O'+A.B'.C'.D.E'.F'.G'.H'.I'.J.K'.L'.M'.N.O+A.B'.C'.D.E'.F'.G.H'.I.J.K'.L.M'.N'.O+A.B'.C.D'.E'.F.G.H.I.J.K.L.M'.N'.O+A.B'.C.D'.E.F'.G'.H.I'.J'.K.L.M'.N'.O+A.B.C'.D.E'.F.G.H'.I'.J.K'.L'.M.N'.O+A.B'.C'.D'.E.F.G'.H.I.J.K.L'.M.N'.O+A'.B'.C'.D'.E.F'.G.H.I'.J'.K'.L'.M.N'.O'+A.B'.C'.D'.E.F'.G'.H.I.J.K.L.M'.N.O+A'.B'.C'.D'.E'.F'.G.H.I.J.K.L.M'.N'.O+A.B'.C.D'.E'.F'.G.H'.I'.J'.K'.L'.M.N.O'+A.B.C'.D'.E.F'.G'.H.I'.J.K'.L.M.N.O'+A'.B.C.D.E.F'.G'.H'.I'.J.K.L'.M.N'.O+A.B'.C'.D'.E.F.G'.H.I'.J'.K'.L.M.N'.O'+A.B'.C.D'.E'.F.G.H'.I.J.K'.L'.M'.N'.O'+A.B.C.D.E'.F'.G.H.I.J.K.L.M'.N'.O+A.B.C'.D.E.F.G'.H'.I.J.K'.L'.M.N'.O+A'.B'.C.D.E'.F'.G.H.I'.J'.K.L.M.N'.O+A.B.C'.D'.E'.F.G'.H'.I'.J.K'.L.M'.N'.O'+A.B'.C'.D.E.F'.G'.H.I'.J'.K.L'.M'.N'.O'+A'.B'.C'.D'.E.F'.G.H'.I.J.K.L.M'.N.O+A'.B.C'.D.E'.F'.G'.H'.I.J.K.L.M.N'.O+A'.B'.C'.D'.E.F.G.H.I'.J.K.L.M.N.O'+A.B'.C.D.E'.F'.G.H.I.J.K.L.M'.N'.O'+A.B'.C'.D'.E'.F'.G'.H.I.J'.K'.L'.M'.N'.O'+A'.B'.C.D'.E.F.G.H.I'.J'.K.L'.M'.N.O'+A'.B'.C'.D'.E'.F'.G'.H.I'.J'.K'.L'.M'.N'.O+A'.B'.C'.D'.E'.F.G'.H.I.J.K.L'.M'.N.O+A'.B'.C'.D.E'.F'.G'.H'.I'.J'.K.L.M.N'.O+A.B'.C'.D.E.F.G'.H'.I.J.K'.L'.M'.N.O'+A'.B.C'.D.E'.F.G.H.I'.J.K.L'.M'.N'.O+A'.B.C'.D'.E.F.G.H.I.J'.K'.L.M.N'.O'+A.B'.C'.D'.E.F.G.H.I.J'.K'.L'.M.N'.O'+A'.B.C'.D.E.F'.G'.H.I'.J'.K.L.M.N.O'+A.B'.C.D.E.F.G'.H.I'.J.K.L'.M'.N.O'+A.B'.C.D'.E.F.G'.H'.I'.J'.K.L.M.N.O+A.B.C'.D'.E'.F.G.H'.I.J.K'.L.M.N'.O'+A.B.C'.D.E'.F'.G.H'.I'.J'.K.L'.M'.N'.O+A'.B.C.D'.E'.F'.G.H'.I.J'.K.L.M'.N.O+A'.B'.C'.D'.E'.F'.G.H.I.J'.K.L.M'.N.O'+A.B'.C'.D.E'.F.G'.H.I.J.K'.L.M.N.O"
// official note : 15 variables w 80 monomes in 1 secondes exactly .
// var expression =
// "AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+A'BC'D'EF'GH'I'JKLMN'O+ABCDEFG'H'I'J'KL'MNO+ABCD'E'FGH'IJK'LM'NO+A'BC'D'E'FGH'I'JKLMN'O'+AB'CDE'F'GHI'J'K'LM'N'O'+A'B'C'DEFG'H'I'JK'L'M'NO+ABCD'EFG'HIJ'K'LM'N'O+A'B'C'DE'F'G'H'IJKL'MN'O'+ABC'DE'FGHIJKLM'NO+A'B'C'DE'F'G'HIJ'KLMN'O'+ABC'D'EFG'H'IJKL'MN'O'+A'B'C'DEFG'H'I'JK'L'MNO'+ABC'D'E'F'GH'IJ'KL'MN'O'+ABCDEF'GH'IJ'KL'MN'O'+A'BC'D'EF'GHIJ'K'LM'NO'+AB'C'D'EFG'HI'JK'LM'NO'+A'BC'D'E'F'G'H'I'J'K'LMNO+A'BC'D'EFG'H'IJKL'M'NO+A'BC'D'E'FGH'I'J'K'L'M'N'O'+AB'C'D'E'F'G'H'I'JK'LMN'O+AB'C'DE'FG'H'IJ'K'LM'N'O+ABCD'EFG'HI'J'KLMNO'+AB'CDEFGHIJK'L'MNO'+A'BC'D'EF'GHIJ'KL'MNO'+AB'CDEFG'HIJKL'M'N'O+A'BCDE'FGHI'J'KL'MN'O'+AB'C'D'E'F'G'H'I'J'K'LMNO'+AB'CD'EFGHI'J'KL'M'NO+AB'CD'EF'G'HI'JK'L'MN'O'+A'B'C'D'EFG'H'IJK'L'MNO'+A'BC'DE'F'G'HI'JKLMN'O'+A'BCD'E'F'GHIJKL'MNO+ABC'DEF'GH'IJKL'M'NO+A'B'CDE'F'G'H'IJ'K'L'M'NO+A'BC'D'EFGHIJK+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+A'BC'D'EF'GH'I'JKLMN'O+ABCDEFG'H'I'J'KL'MNO+ABCD'E'FGH'IJK'LM'NO+A'BC'D'E'FGH'I'JKLMN'O'+AB'CDE'F'GHI'J'K'LM'N'O'+A'B'C'DEFG'H'I'JK'L'M'NO+ABCD'EFG'HIJ'K'LM'N'O+A'B'C'DE'F'G'H'IJKL'MN'O'+ABC'DE'FGHIJKLM'NO+A'B'C'DE'F'G'HIJ'KLMN'O'+ABC'D'EFG'H'IJKL'MN'O'+A'B'C'DEFG'H'I'JK'L'MNO'+ABC'D'E'F'GH'IJ'KL'MN'O'+ABCDEF'GH'IJ'KL'MN'O'+A'BC'D'EF'GHIJ'K'LM'NO'+AB'C'D'EFG'HI'JK'LM'NO'+A'BC'D'E'F'G'H'I'J'K'LMNO+A'BC'D'EFG'H'IJKL'M'NO+A'BC'D'E'FGH'I'J'K'L'M'N'O'+AB'C'D'E'F'G'H'I'JK'LMN'O+AB'C'DE'FG'H'IJ'K'LM'N'O+ABCD'EFG'HI'J'KLMNO'+AB'CDEFGHIJK'L'MNO'+A'BC'D'EF'GHIJ'KL'MNO'+AB'CDEFG'HIJKL'M'N'O+A'BCDE'FGHI'J'KL'MN'O'+AB'C'D'E'F'G'H'I'J'K'LMNO'+AB'CD'EFGHI'J'KL'M'NO+AB'CD'EF'G'HI'JK'L'MN'O'+A'B'C'D'EFG'H'IJK'L'MNO'+A'BC'DE'F'G'HI'JKLMN'O'+A'BCD'E'F'GHIJKL'MNO+ABC'DEF'GH'IJKL'M'NO+A'B'CDE'F'G'H'IJ'K'L'M'NO+A'BC'D'EFGHIJK+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO+AB'C'D'E'FG'H'IJKLMN'O+A'BCDE'F'G'HI'JKLMN'O+A'B'C'DEF'G'H'I'JK'L'M'N'O'+AB'CDEFG'H'I'J'K'L'M'N'O'+A'BC'D'EFG'H'I'JKLMN'O+ABCD'E'FG'HI'JK'LMN'O'+AB'CD'E'F'G'H'I'J'K'L'MN'O+ABCD'EFG'HIJ'K'LM'NO'+A'BC'D'E'F'G'HI'JK'LM'NO+A'B'C'D'EFGH'IJ'KLMNO+ABC'DEF'GH'I'JKLMNO'+A'B'CD'E'FG'H'I'JK'LMNO+A'BCDE'F'G'HIJKLM'N'O+ABC'DEFGH'IJKLMN'O'+AB'C'D'E'FGH'I'JK'L'M'NO'+ABCD'EF'GH'I'J'K'LM'N'O'+A'B'CD'E'F'GHIJKL'M'N'O'+A'B'CDE'FGH'I'J'KLM'NO+ABC'DE'FG'HIJ'KL'M'NO'+AB'C'DE'FGH'IJK'LMNO'+ABCD'E'FGHI'JKL'M'N'O+A'B'C'DE'FG'H'IJKLM'N'O+AB'C'D'EFG'H'I'J'K'L'M'N'O'+AB'C'DEFG'HIJKLM'NO'+A'BC'DEF'G'H'I'J'KL'MNO'+A'B'CD'EFG'H'I'JKL'MN'O'+ABC'D'EF'G'H'I'JKLM'N'O+A'BCDEFG'HI'JKL'M'N'O'+A'B'C'D'EF'GHI'JK'LM'NO+A'BCDEFGHI'JKLMNO+A'BCD'E'FGH'I'J'K'L'M'NO+A'B'C'D'E'F'GHIJK'LM'N'O+AB'C'DEF'GHIJ'KL'M'N'O+A'BCDE'FG'HI'J'KL'M'NO+A'B'C'DE'FG'H'IJKLMNO'+A'B'C'D'EFG'HIJ'KL'M'N'O'+ABC'DE'FG'HIJ'KLMNO+A'BC'D'E'F'G'H'IJ'KLMNO+A'B'CDE'F'G'HIJ'KL'M'NO'+A'B'CDE'F'G'HI'JKL'MN'O+A'BC'DEFGHI'JKL'MNO+AB'CDEFGH'I'JKLMN'O+AB'C'DE'F'GH'I'JKLMN'O+A'BC'D'EF'G'H'IJ'KLMN'O'+A'B'C'D'EF'G'H'I'JK'L'M'N'O+ABCDE'F'G'HI'JKLMNO+A'BCDEF'GH'I'JK'LM'N'O+AB'C'D'EF'G'H'IJK'L'MN'O+AB'CD'EF'G'H'I'JK'L'MN'O'+ABC'D'EFG'H'I'J'KL'MN'O+A'B'CD'E'F'G'H'I'J'K'L'M'NO'+AB'C'DE'FG'H'IJKLMNO'+ABCDE'F'G'H'IJK'LM'N'O+ABC'D'E'F'GH'I'JKLMN'O+AB'CDE'F'G'HI'JKL'MN'O'+A'BC'DE'F'GHIJ'K'LM'N'O+A'B'C'DE'F'GH'IJK'L'M'NO+ABCD'E'FGHI'JKLMN'O+A'BCDEF'GHI'J'K'LMN'O+ABCD'EFG'HIJK'LMN'O'+ABC'D'E'F'GH'IJ'KLMN'O'+A'B'CDE'FGH'I'J'KL'MN'O'+A'BCDEF'GHI'J'K'LM'N'O'+A'BCDE'F'GH'I'JK'L'M'N'O'+A'BC'DEF'GH'IJ'KL'MNO";
// var expression =
// "A'B'CD'EF'G'H'I'JK'L'M'N'O'P'+ A'B'CD'E'F'G'H'IJ'K'LM'N'O'P'+ A'BC'DE'F'G'H'IJ'K'L'M'N'O'P'+ AB'CD'E'F'G'H'I'J'K'L'M'N'O'P+ A'B'C'D'EFG'H'I'J'KL'M'NO'P'+ A'B'C'D'EFG'H'I'J'KLM'N'O'P'+ A'BC'DEF'G'H'I'J'K'L'M'N'O'P+ AB'C'D'E'F'G'HIJK'L'M'N'O'P'+ A'B'C'D'E'F'GHI'J'K'L'MNO'P+ A'B'C'D'EFG'H'IJ'K'L'MN'OP'+ A'B'C'DE'F'GH'IJK'LM'N'O'P'+ A'B'C'DE'F'G'HI'JK'L'M'N'OP+ A'BC'D'E'F'GH'IJ'K'LM'N'OP'+ A'BC'D'E'FG'HI'J'KL'MN'O'P'+ A'BC'DE'FG'H'IJ'KL'M'N'O'P'+ ABC'D'E'F'G'HI'JK'L'M'NO'P'+ ABC'DE'F'G'H'IJ'K'L'M'NO'P'+ AB'C'DE'FG'H'IJ'K'L'M'N'O'P+ AB'C'D'E'F'G'H'I'JKL'M'N'OP+ A'B'C'D'E'F'GH'I'JK'LMNOP'+ A'B'C'D'E'FG'H'IJKLM'N'O'P+ A'B'C'D'E'FG'HIJ'KLMN'O'P'+ A'B'C'D'EF'G'HIJ'K'LMN'O'P+ A'B'C'DEF'G'HIJK'L'M'NO'P'+ A'B'CD'EF'G'HIJ'K'L'MN'OP'+ A'B'CD'E'FG'H'I'JKL'MNO'P'+ A'B'CDE'F'G'HI'JK'L'MN'O'P+ A'B'CD'E'F'G'HIJK'L'M'NO'P+ A'B'CD'E'FGH'IJ'K'LM'N'OP'+ A'BC'D'E'F'GHI'JK'LM'NO'P'+ A'BC'D'EF'GHI'JK'L'M'NO'P'+ A'BC'D'EF'G'H'IJK'L'MNO'P'+ A'BC'DE'F'GH'IJ'KL'M'N'OP'+ A'BCDEF'G'H'IJ'K'L'MN'O'P'+ A'BC'DE'FGHI'JK'L'M'N'O'P'+ A'BCD'E'FG'HI'JK'L'M'N'OP'+ A'BCD'E'F'G'HIJ'K'LM'NO'P'+ A'BC'D'EFG'HI'J'KL'M'N'OP'+ AB'C'DEFG'H'I'JK'L'MN'O'P'+ AB'C'D'E'F'GHI'JK'L'MN'OP'+ AB'C'D'E'F'GHI'JK'LM'N'O'P+ AB'C'DE'FGH'IJ'K'L'M'N'OP'+ AB'C'DEF'G'H'I'J'KLM'N'O'P+ AB'C'D'E'F'G'HI'J'K'LM'NOP+ AB'C'D'E'FG'H'I'JK'LM'N'OP+ AB'C'DEFG'H'I'J'K'L'MN'OP'+ AB'CDE'FG'H'I'J'K'L'M'NOP'+ AB'C'D'E'FG'H'I'JKLMN'O'P'+ AB'C'DE'FG'H'IJK'L'M'N'OP'+ AB'CDE'F'G'H'IJ'K'L'MN'O'P+ A'B'C'D'EFG'HI'J'KLMN'OP'+ A'B'C'D'EFG'HIJK'LMN'O'P'+ A'B'C'D'EFGH'I'JKLM'N'OP'+A'B'C'D'EF'GHI'J'K'LMNO'P+A'B'C'DE'FGHI'JK'L'MN'O'P+A'B'CD'EFGH'I'J'KL'M'NO'P+A'B'CD'EF'GHI'J'KL'MNO'P'+A'B'CDEF'G'H'IJ'KL'M'N'OP+A'B'CDEFG'H'IJ'K'LM'NO'P'+A'B'CD'E'F'GHIJ'KL'MN'OP'+A'B'CD'E'F'G'HIJ'K'LMN'OP+A'B'CDEF'GH'IJK'L'M'N'O'P+A'B'CDEF'GH'I'J'K'LMN'OP'+A'BC'D'EF'G'H'IJ'KL'M'NOP+A'BCDEF'G'HIJ'KL'M'N'O'P'+A'BC'D'EFG'H'IJ'K'LM'NO'P+A'BCD'E'FG'H'I'JK'LMN'OP'+A'BC'DE'FG'H'IJK'LM'NO'P'+A'BC'D'EFGH'I'J'KLM'N'O'P+A'BC'DEF'GH'I'J'K'LMNO'P'+A'BC'DEF'GH'I'J'KLM'N'O'P+A'BCD'E'F'GHI'J'KL'M'N'OP+A'BCDE'FGH'I'JKL'M'N'O'P'+A'BC'DE'F'G'HIJ'KL'M'NOP'+A'BC'DE'FGHI'J'K'LM'NO'P'+A'BC'D'E'FG'H'I'JKLMN'O'P+A'BC'D'E'FG'HI'J'KLMN'O'P+A'BCDE'F'G'HIJ'KL'M'N'OP'+A'BC'DEF'G'H'I'JK'L'M'NOP+ABC'DEF'G'H'I'J'K'L'MN'OP+ABC'D'E'F'G'HI'J'KL'MNOP'+ABC'D'E'F'G'H'IJ'KL'MN'OP+AB'C'DEF'GH'IJK'L'M'N'O'P+ABC'DEF'GHI'J'K'L'M'N'O'P+AB'CD'EF'G'H'IJKL'M'NO'P'+AB'C'D'EFG'HI'J'KLM'N'O'P+ABC'D'E'F'G'HIJK'L'M'NOP'+AB'C'D'EF'G'H'IJKL'MNO'P'+AB'CD'E'F'G'HI'J'K'LMN'OP+AB'C'D'E'F'GHI'JK'LMNO'P'+ABC'D'EF'G'H'I'JKL'MN'OP'+ABCDE'F'GH'IJK'L'M'N'O'P'+ABC'DE'F'GH'IJKL'M'N'O'P'+ABCDE'F'G'H'IJ'K'LM'N'O'P+AB'CD'E'F'G'H'IJKL'MN'OP'+ABCD'EFG'H'I'J'K'LM'N'O'P+ABC'DEF'G'H'I'J'KL'M'NOP'+ABC'DEFG'H'I'J'K'L'MN'O'P+AB'C'D'EFG'H'IJKLM'N'O'P'+A'B'C'D'EFGHI'J'K'LMN'OP+A'B'C'D'EF'GHI'JKLMNO'P'+A'B'C'DE'FGHI'J'KLMN'O'P+A'B'C'DE'F'GHIJKL'MN'OP'+A'B'C'DE'FGHI'JK'LM'NO'P+A'B'C'DE'FG'HI'J'KLMNO'P+A'B'CDEF'GH'I'JK'LM'NO'P+A'B'CDE'FGH'I'JK'LM'NO'P+A'B'CD'E'FGH'I'JK'LMNOP'+A'B'CDE'F'G'H'IJK'L'MNOP+A'B'CDE'FGHIJK'L'M'N'OP'+A'B'CDEF'GHI'J'K'L'MNOP'+A'BCD'EF'GHI'JK'L'MN'OP'+A'BCD'EFG'H'I'JK'L'MNOP'+A'BC'D'EF'G'HIJKL'MNO'P'+A'BCDE'F'G'HI'JKL'M'NO'P+A'BCD'EF'G'H'I'JKL'MNO'P+A'BC'D'EFGHI'J'KLM'N'OP'+A'BC'D'EF'GH'IJK'L'MNO'P+A'BC'DEFGH'IJ'K'LM'N'O'P+A'BCDEF'GH'I'JKL'M'N'OP'+ABCDE'FGH'I'JK'L'M'N'OP'+ABCD'E'F'GH'IJ'KL'MN'OP'+ABCDE'FG'H'I'J'K'L'MN'OP+ABCD'E'FGH'I'J'KLMN'O'P'+ABC'DEFG'H'IJK'LM'N'O'P'+ABC'D'E'F'G'HI'JKL'MN'OP+ABCDE'F'G'H'I'J'K'LM'NOP+AB'C'DE'F'G'HI'JK'L'MNOP+ABCDE'F'G'H'IJ'KLMN'O'P'+AB'CDE'FG'HI'JKL'M'N'OP'+AB'C'DE'FG'HI'J'KLMNO'P'+ABCD'E'F'G'HI'J'KL'M'NOP+ABC'DEF'GH'IJK'L'M'N'OP'+ABCD'E'F'GHIJ'KL'MN'O'P'+AB'C'D'EFG'HIJK'L'MNO'P'+AB'CD'EFGH'IJ'K'L'M'NOP'+ABC'D'E'FG'HIJ'K'L'MN'OP+AB'C'D'EF'G'HIJ'KLMN'O'P+AB'CDE'F'G'HIJ'K'L'MNO'P+AB'CD'E'F'G'HIJK'LM'NOP'+A'B'C'D'E'FGH'IJK'LMNOP+A'B'C'D'EFG'HI'J'KLMNOP+A'B'C'DEF'GH'IJ'KLM'NOP+A'B'C'DEFGHI'JKL'M'NO'P+A'B'C'DEFGH'IJK'L'MN'OP+A'B'CDE'F'G'HIJKLMN'OP'+A'B'CDEFGH'IJ'K'L'MNO'P+A'B'CDEF'G'HI'JKLM'NOP'+A'BC'DEF'GH'IJK'LMN'O'P+A'BC'D'EF'GH'I'JKLMNOP'+A'BCDEF'GHIJ'K'LM'N'OP'+A'BC'D'E'FG'H'IJK'LMNOP+A'BCDEFG'HI'J'K'LMN'O'P+A'BCDEFG'HI'J'KLM'N'OP'+A'BCDE'FGH'I'JK'LM'N'OP+A'BCD'EFG'H'IJ'K'LMNOP'+A'BC'DEFG'H'I'J'KLMN'OP+A'BCD'EFG'HI'JKL'MNO'P'+AB'CD'E'FGHIJ'K'LM'NO'P+AB'C'DEFGH'I'JK'L'M'NOP+ABC'DE'FG'HI'JK'L'MNO'P+ABC'D'EFGH'IJK'L'MN'O'P+ABC'DEF'GH'I'J'KLM'NO'P+AB'CD'E'FG'HIJ'KL'MN'OP+ABC'DE'FG'H'I'JK'L'MNOP+AB'CDEF'GHI'J'KLMN'O'P'+ABCD'EF'G'HIJKL'M'NO'P'+AB'C'DEFGHIJ'KL'M'N'OP'+ABCD'E'FG'HI'JK'L'M'NOP+AB'CDE'F'GH'IJ'KLM'N'OP+AB'C'D'EFGH'I'JK'LMN'OP+ABCDE'FGHI'J'K'L'M'NO'P+ABC'D'EFGH'I'JKL'M'NOP'+AB'CD'EF'G'H'I'J'KLMNOP+ABC'D'EF'G'HI'J'KLMNO'P+AB'CDEFGH'I'J'K'LMNO'P'+ABCDE'F'GHIJK'L'M'N'O'P+A'B'C'DEFGH'IJK'LM'NOP+A'B'CD'E'FG'HIJKLMN'OP+A'B'CD'EFG'HIJKLM'NO'P+A'BC'DEFGHIJKL'M'N'O'P+A'BCDEF'GH'IJ'K'LMNO'P+A'BC'DEF'GHIJ'K'LMNO'P+ABC'DEFGHIJ'KLM'N'O'P'+ABC'DEF'G'H'IJ'KLMNO'P+ABCDE'F'G'HI'JK'LMNO'P+AB'CD'E'F'GHIJ'KLMNO'P+ABCD'E'F'GH'IJ'KLM'NOP+AB'CDEF'G'HI'J'KLMNO'P+AB'C'D'E'FG'HIJKLMNO'P+ABCD'E'FG'HIJ'KLM'NOP'+ABC'DE'FGHI'JKLM'N'O'P+AB'CD'E'FG'HIJKLMN'OP'+AB'C'DEF'GH'I'JKLM'NOP+ABC'DEF'G'HIJ'K'LMNO'P+AB'CD'EFGHIJ'K'L'MN'OP+ABCDEFGH'I'JK'L'M'NOP'+AB'CDEFG'HI'J'KLM'N'OP+ABCD'EFGHIJK'LM'N'O'P'+AB'CD'E'FGHIJK'L'M'NOP+ABC'D'EFGHI'JKL'M'N'OP+A'B'CDEFGH'IJ'KLM'NOP+A'BCDEFG'HIJKL'M'N'OP+A'BCDEFG'HIJKL'MN'OP'+A'BCDEF'G'HIJK'LMNO'P+AB'C'DE'F'GHIJKLMN'OP+AB'CDEFG'HIJKLM'N'OP'+AB'C'D'EFGH'IJKLMNOP'+AB'C'DEFGHIJ'KL'MN'OP+ABC'D'EFGH'IJ'KLMNO'P+AB'CD'EF'GHI'J'KLMNOP+AB'CDEF'GH'IJK'LM'NOP+ABCDE'F'GHIJKL'MN'O'P+AB'CDE'FG'H'IJKLM'NOP+ABC'DEFGHIJ'K'LMN'O'P+ABCDEF'GH'I'J'KLMNOP'+ABCDE'FGHIJKL'MN'O'P'+A'B'CDEFGHIJKL'MN'OP+A'B'CDEF'GHIJKLM'NOP+A'BCDEF'GHIJKLM'N'OP+ABC'DEFGHI'JKL'M'NOP+ABCDE'FG'HIJK'LM'NOP+AB'CD'EFGHIJKLM'NO'P+ABCDE'F'GHIJK'LMNOP'+ABC'DEFGHIJ'KL'M'NOP+ABCD'E'FGHI'JKLM'NOP+A'BCDEF'G'HIJKLMNOP+ABCDEFGH'IJ'K'LMNOP+ABCDEFGH'I'J'KLMNOP+ABCDEFGHI'J'KLM'NOP+A'BCDEFGHIJ'KLMNOP+A'B'CDE'G'H'I'J'K'LM'NOP'+A'BD'EF'GH'I'J'K'L'M'N'OP+B'C'D'E'FGH'IJ'K'L'MNO'P+ABC'D'E'FG'H'IK'LMN'O'P'+ABC'D'EG'H'I'J'K'LMN'O'P+AB'C'D'E'F'GH'I'JKLMNO'+B'CD'EFGHIJ'K'LM'N'OP'+ABC'D'EF'GHIJK'LM'N'P'+ABCDE'F'G'H'IKLM'NO'P'+ABCDE'F'G'H'IJKLM'NO'";
// var expression =
// "A'B'CD'EF'G'H'I'JK'L'M'N'O'P' + AB'CD'E'F'G'H'I'J'K'L'M'N'O'P + A'BC'DE'F'G'H'IJ'K'L'M'N'O'P' + A'B'CD'E'F'G'H'IJ'K'LM'N'O'P' + A'B'C'D'EFG'H'I'J'KL'M'NO'P' + AB'C'D'E'F'G'HIJK'L'M'N'O'P' + A'BC'DEF'G'H'I'J'K'L'M'N'O'P + A'B'C'D'EFG'H'I'J'KLM'N'O'P' + ABC'D'E'F'G'HI'JK'L'M'NO'P' + ABC'DE'F'G'H'IJ'K'L'M'NO'P' + A'B'C'D'EFG'H'IJ'K'L'MN'OP' + A'BC'D'E'F'GH'IJ'K'LM'N'OP' + AB'C'DE'FG'H'IJ'K'L'M'N'O'P + A'BC'D'E'FG'HI'J'KL'MN'O'P' + A'BC'DE'FG'H'IJ'KL'M'N'O'P' + A'B'C'DE'F'GH'IJK'LM'N'O'P' + AB'C'D'E'F'G'H'I'JKL'M'N'OP + A'B'C'DE'F'G'HI'JK'L'M'N'OP + A'B'C'D'E'F'GHI'J'K'L'MNO'P + A'B'CD'EF'G'HIJ'K'L'MN'OP' + A'BC'D'E'F'GHI'JK'LM'NO'P' + A'B'C'D'E'F'GH'I'JK'LMNOP' + AB'C'DEFG'H'I'JK'L'MN'O'P' + A'B'C'D'E'FG'H'IJKLM'N'O'P + AB'C'D'E'F'GHI'JK'L'MN'OP' + A'B'CD'E'FG'H'I'JKL'MNO'P' + AB'C'D'E'F'GHI'JK'LM'N'O'P + AB'C'DE'FGH'IJ'K'L'M'N'OP' + AB'C'DEF'G'H'I'J'KLM'N'O'P + AB'C'D'E'F'G'HI'J'K'LM'NOP + AB'C'D'E'FG'H'I'JK'LM'N'OP + A'BC'D'EF'GHI'JK'L'M'NO'P' + A'BC'D'EF'G'H'IJK'L'MNO'P' + A'B'C'DEF'G'HIJK'L'M'NO'P' + AB'C'DEFG'H'I'J'K'L'MN'OP' + AB'CDE'FG'H'I'J'K'L'M'NOP' + A'B'C'D'E'FG'HIJ'KLMN'O'P' + A'BC'DE'F'GH'IJ'KL'M'N'OP' + A'B'C'D'EF'G'HIJ'K'LMN'O'P + AB'C'D'E'FG'H'I'JKLMN'O'P' + A'BCDEF'G'H'IJ'K'L'MN'O'P' + A'B'CDE'F'G'HI'JK'L'MN'O'P + A'BC'DE'FGHI'JK'L'M'N'O'P' + AB'C'DE'FG'H'IJK'L'M'N'OP' + AB'CDE'F'G'H'IJ'K'L'MN'O'P + A'B'CD'E'F'G'HIJK'L'M'NO'P + A'BCD'E'FG'HI'JK'L'M'N'OP' + A'B'CD'E'FGH'IJ'K'LM'N'OP' + A'BCD'E'F'G'HIJ'K'LM'NO'P' + A'BC'D'EFG'HI'J'KL'M'N'OP' + ABC'DEF'G'H'I'J'K'L'MN'OP + ABC'D'E'F'G'HI'J'KL'MNOP' + ABC'D'E'F'G'H'IJ'KL'MN'OP + A'BC'D'EF'G'H'IJ'KL'M'NOP + AB'C'DEF'GH'IJK'L'M'N'O'P + A'BCDEF'G'HIJ'KL'M'N'O'P' + A'B'C'DE'FGHI'JK'L'MN'O'P + A'BC'D'EFG'H'IJ'K'LM'NO'P + ABC'DEF'GHI'J'K'L'M'N'O'P + A'B'C'D'EFG'HI'J'KLMN'OP' + A'BCD'E'FG'H'I'JK'LMN'OP' + A'BC'DE'FG'H'IJK'LM'NO'P' + A'BC'D'EFGH'I'J'KLM'N'O'P + A'B'CD'EFGH'I'J'KL'M'NO'P + A'BC'DEF'GH'I'J'K'LMNO'P' + A'B'CD'EF'GHI'J'KL'MNO'P' + AB'CD'EF'G'H'IJKL'M'NO'P' + A'B'CDEF'G'H'IJ'KL'M'N'OP + A'BC'DEF'GH'I'J'KLM'N'O'P + A'BCD'E'F'GHI'J'KL'M'N'OP + A'B'C'D'EFG'HIJK'LMN'O'P' + AB'C'D'EFG'HI'J'KLM'N'O'P + ABC'D'E'F'G'HIJK'L'M'NOP' + A'B'CDEFG'H'IJ'K'LM'NO'P' + A'BCDE'FGH'I'JKL'M'N'O'P' + A'B'C'D'EFGH'I'JKLM'N'OP' + AB'C'D'EF'G'H'IJKL'MNO'P' + AB'CD'E'F'G'HI'J'K'LMN'OP + A'BC'DE'F'G'HIJ'KL'M'NOP' + AB'C'D'E'F'GHI'JK'LMNO'P' + A'BC'DE'FGHI'J'K'LM'NO'P' + ABC'D'EF'G'H'I'JKL'MN'OP' + A'B'CD'E'F'GHIJ'KL'MN'OP' + ABCDE'F'GH'IJK'L'M'N'O'P' + A'B'CD'E'F'G'HIJ'K'LMN'OP + A'B'C'D'EF'GHI'J'K'LMNO'P + A'BC'D'E'FG'H'I'JKLMN'O'P + ABC'DE'F'GH'IJKL'M'N'O'P' + A'BC'D'E'FG'HI'J'KLMN'O'P + A'B'CDEF'GH'IJK'L'M'N'O'P + A'BCDE'F'G'HIJ'KL'M'N'OP' + ABCDE'F'G'H'IJ'K'LM'N'O'P + AB'CD'E'F'G'H'IJKL'MN'OP' + A'B'CDEF'GH'I'J'K'LMN'OP' + ABCD'EFG'H'I'J'K'LM'N'O'P + ABC'DEF'G'H'I'J'KL'M'NOP' + A'BC'DEF'G'H'I'JK'L'M'NOP + ABC'DEFG'H'I'J'K'L'MN'O'P + AB'C'D'EFG'H'IJKLM'N'O'P' + A'B'C'DE'FGHI'J'KLMN'O'P + ABCDE'FGH'I'JK'L'M'N'OP' + A'B'CDEF'GH'I'JK'LM'NO'P + A'BCD'EF'GHI'JK'L'MN'OP' + A'B'CDE'FGH'I'JK'LM'NO'P + A'BCD'EFG'H'I'JK'L'MNOP' + ABCD'E'F'GH'IJ'KL'MN'OP' + ABCDE'FG'H'I'J'K'L'MN'OP + ABCD'E'FGH'I'J'KLMN'O'P' + ABC'DEFG'H'IJK'LM'N'O'P' + ABC'D'E'F'G'HI'JKL'MN'OP + ABCDE'F'G'H'I'J'K'LM'NOP + A'BC'D'EF'G'HIJKL'MNO'P' + A'B'CD'E'FGH'I'JK'LMNOP' + AB'C'DE'F'G'HI'JK'L'MNOP + A'BCDE'F'G'HI'JKL'M'NO'P + A'B'C'DE'F'GHIJKL'MN'OP' + A'B'CDE'F'G'H'IJK'L'MNOP + A'BCD'EF'G'H'I'JKL'MNO'P + ABCDE'F'G'H'IJ'KLMN'O'P' + A'B'C'D'EFGHI'J'K'LMN'OP + A'B'C'DE'FGHI'JK'LM'NO'P + AB'CDE'FG'HI'JKL'M'N'OP' + A'BC'D'EFGHI'J'KLM'N'OP' + AB'C'DE'FG'HI'J'KLMNO'P' + ABCD'E'F'G'HI'J'KL'M'NOP + ABC'DEF'GH'IJK'L'M'N'OP' + A'B'C'D'EF'GHI'JKLMNO'P' + A'BC'D'EF'GH'IJK'L'MNO'P + ABCD'E'F'GHIJ'KL'MN'O'P' + A'B'C'DE'FG'HI'J'KLMNO'P + AB'C'D'EFG'HIJK'L'MNO'P' + AB'CD'EFGH'IJ'K'L'M'NOP' + ABC'D'E'FG'HIJ'K'L'MN'OP + A'BC'DEFGH'IJ'K'LM'N'O'P + AB'C'D'EF'G'HIJ'KLMN'O'P + A'B'CDE'FGHIJK'L'M'N'OP' + AB'CDE'F'G'HIJ'K'L'MNO'P + A'BCDEF'GH'I'JKL'M'N'OP' + AB'CD'E'F'G'HIJK'LM'NOP' + A'B'CDEF'GHI'J'K'L'MNOP' + A'B'C'DEF'GH'IJ'KLM'NOP + A'BC'DEF'GH'IJK'LMN'O'P + A'B'C'D'E'FGH'IJK'LMNOP + AB'CD'E'FGHIJ'K'LM'NO'P + A'B'CDE'F'G'HIJKLMN'OP' + AB'C'DEFGH'I'JK'L'M'NOP + A'B'C'D'EFG'HI'J'KLMNOP + ABC'DE'FG'HI'JK'L'MNO'P + A'BC'D'EF'GH'I'JKLMNOP' + ABC'D'EFGH'IJK'L'MN'O'P + ABC'DEF'GH'I'J'KLM'NO'P + A'BCDEF'GHIJ'K'LM'N'OP' + AB'CD'E'FG'HIJ'KL'MN'OP + ABC'DE'FG'H'I'JK'L'MNOP + AB'CDEF'GHI'J'KLMN'O'P' + ABCD'EF'G'HIJKL'M'NO'P' + A'BC'D'E'FG'H'IJK'LMNOP + A'BCDEFG'HI'J'K'LMN'O'P + A'BCDEFG'HI'J'KLM'N'OP' + AB'C'DEFGHIJ'KL'M'N'OP' + A'B'CDEFGH'IJ'K'L'MNO'P + ABCD'E'FG'HI'JK'L'M'NOP + A'BCDE'FGH'I'JK'LM'N'OP + A'B'CDEF'G'HI'JKLM'NOP' + AB'CDE'F'GH'IJ'KLM'N'OP + AB'C'D'EFGH'I'JK'LMN'OP + ABCDE'FGHI'J'K'L'M'NO'P + ABC'D'EFGH'I'JKL'M'NOP' + AB'CD'EF'G'H'I'J'KLMNOP + A'B'C'DEFGHI'JKL'M'NO'P + ABC'D'EF'G'HI'J'KLMNO'P + A'BCD'EFG'H'IJ'K'LMNOP' + AB'CDEFGH'I'J'K'LMNO'P' + A'BC'DEFG'H'I'J'KLMN'OP + A'B'C'DEFGH'IJK'L'MN'OP + A'BCD'EFG'HI'JKL'MNO'P' + ABCDE'F'GHIJK'L'M'N'O'P + ABC'DEFGHIJ'KLM'N'O'P' + ABC'DEF'G'H'IJ'KLMNO'P + A'BC'DEFGHIJKL'M'N'O'P + A'BCDEF'GH'IJ'K'LMNO'P + ABCDE'F'G'HI'JK'LMNO'P + A'B'C'DEFGH'IJK'LM'NOP + AB'CD'E'F'GHIJ'KLMNO'P + ABCD'E'F'GH'IJ'KLM'NOP + AB'CDEF'G'HI'J'KLMNO'P + A'B'CD'E'FG'HIJKLMN'OP + AB'C'D'E'FG'HIJKLMNO'P + ABCD'E'FG'HIJ'KLM'NOP' + ABC'DE'FGHI'JKLM'N'O'P + AB'CD'E'FG'HIJKLMN'OP' + AB'C'DEF'GH'I'JKLM'NOP + A'BC'DEF'GHIJ'K'LMNO'P + ABC'DEF'G'HIJ'K'LMNO'P + AB'CD'EFGHIJ'K'L'MN'OP + ABCDEFGH'I'JK'L'M'NOP' + AB'CDEFG'HI'J'KLM'N'OP + ABCD'EFGHIJK'LM'N'O'P' + A'B'CD'EFG'HIJKLM'NO'P + AB'CD'E'FGHIJK'L'M'NOP + ABC'D'EFGHI'JKL'M'N'OP + AB'C'DE'F'GHIJKLMN'OP + AB'CDEFG'HIJKLM'N'OP' + AB'C'D'EFGH'IJKLMNOP' + A'BCDEFG'HIJKL'M'N'OP + AB'C'DEFGHIJ'KL'MN'OP + ABC'D'EFGH'IJ'KLMNO'P + A'B'CDEFGH'IJ'KLM'NOP + AB'CD'EF'GHI'J'KLMNOP + A'BCDEFG'HIJKL'MN'OP' + A'BCDEF'G'HIJK'LMNO'P + AB'CDEF'GH'IJK'LM'NOP + ABCDE'F'GHIJKL'MN'O'P + AB'CDE'FG'H'IJKLM'NOP + ABC'DEFGHIJ'K'LMN'O'P + ABCDEF'GH'I'J'KLMNOP' + ABCDE'FGHIJKL'MN'O'P' + ABC'DEFGHI'JKL'M'NOP + ABCDE'FG'HIJK'LM'NOP + A'BCDEF'GHIJKLM'N'OP + A'B'CDEFGHIJKL'MN'OP + AB'CD'EFGHIJKLM'NO'P + ABCDE'F'GHIJK'LMNOP' + ABC'DEFGHIJ'KL'M'NOP + A'B'CDEF'GHIJKLM'NOP + ABCD'E'FGHI'JKLM'NOP + ABCDEFGH'IJ'K'LMNOP + ABCDEFGH'I'J'KLMNOP + ABCDEFGHI'J'KLM'NOP + A'BCDEF'G'HIJKLMNOP + A'BCDEFGHIJ'KLMNOP + A'BD'EF'GH'I'J'K'L'M'N'OP + A'B'CDE'G'H'I'J'K'LM'NOP' + B'C'D'E'FGH'IJ'K'L'MNO'P + ABC'D'E'FG'H'IK'LMN'O'P' + ABC'D'EG'H'I'J'K'LMN'O'P + AB'C'D'E'F'GH'I'JKLMNO' + ABC'D'EF'GHIJK'LM'N'P' + ABCDE'F'G'H'IKLM'NO'P' + B'CD'EFGHIJ'K'LM'N'OP' + ABCDE'F'G'H'IJKLM'NO'";
// notes 55 monome w 14 variable f 1.4 seconds
// notes : 22 monomes w 15 varibales f 1.2 seconds 40 mintermes f 1.8 seconds.
// notes : best i can do is 15 variables with no matther what number of monomes . in 1 seconds only
// 16 varibales in 2 secs .
//var expression ="ab+ef+ abd ++Abcd +a'bd + a'b'c'd' + ef'a' + abg' + a'b'c'd'e'f + a'b'c'def'+a'c'd'g'i' + abcdef'g'i + a'b'cde'gi' + asdf'd's' +a+b+c+d+e+f+af+ae+ab+av+e+fe+ge+g' +a+b+e+n'+n'm'ad'+g'+av'de's' + abd'+ad'e'+acdem'+adefgh'e + afgh' + afeacfg' +abfn+amne'+ cd'ef + aef'h' + z+az' + edfeaz' + efca'zdc' + ab'cezd'c'+ a'cb'ed'+bz'efg'h'f' + acd'e'f'g'hz'+ab+ef+ abd +a'bd + a'b'c'd' + a'bc'd'e'+ef'a' ++ a'b'c'd' + a'bc'd'e' + ef'a' + abg' + a'b'c'd'e'f + a'b'c'def' + e'f'g' + abc'd'e'fgi' + a'c'd'g'i' + abcdef'g'i + a'b'cde'gi' + asdf'd's' +a+b+c+ abg' + a'b'c'd'e'f + a'b'c'  "
//var expression ="ab+ef+ abd +B+X+E+Abcd +a'bd + a'b'c'd' + ef'a' + abg' + a'b'c'd'e'f + a'b'c'def'+a'c'd'g'i' + abcdef'g'i + a'b'cde'gi' + asdf'd's' +a+b+c+d+e+f+af+ae+ab+av+e+fe+ge+g' +a+b+e+n'+n'm'ad'+g'+av'de's' + abd'+ad'e'+acdem'+adefgh'e + afgh' + afeacfg' +abfn+amne'+ cd'ef + aef'h' + z+az' + edfeaz' + efca'zdc' + ab'cezd'c'+ a'cb'ed'+bz'efg'h'f' + acd'e'f'g'hz'+ab+ef+ abd +a'bd + a'b'c'd' + a'bc'd'e'+ef'a' ++ a'b'c'd' + a'bc'd'e' + ef'a' + abg' + a'b'c'd'e'f + a'b'c'def' + e'f'g' + abc'd'e'fgi' + a'c'd'g'i' + abcdef'g'i + a'b'cde'gi' + asdf'd's' +a+b+c+ abg' + a'b'c'd'e'f + a'b'c'  "
// var expression="ab+abc'd'e+cde"
// var expression = "A+CD'F+A'BD'+CDE'F";
// var expression = "AB+CD'+A'B'CD+A'B'+CD+E'+D'F'C'";
// expression = "A'B'+D'F'+E'+AB+C"
// expression="A+BCD+BCD+B'C'"

// var reponse = comparaison("00000", "13", "00000");
// reponse;
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}
function allVariables(expression) {
  var listDesChars = expression.split("");
  var VarsInExp = [];
  for (var i in listDesChars) {
    if (isLetter(listDesChars[i]) && !VarsInExp.includes(listDesChars[i])) {
      VarsInExp.push(listDesChars[i]);
    }
  }
  return VarsInExp;
}
function main(expression) {
  function comparaison(binOriginal, indices, generatedBin) {
    var listeDesIndices = indices;
    listeDesIndices;
    var rien = 0;
    for (var k = 0; k < listeDesIndices.length; k++) {
      listeDesIndices;
      rien = binOriginal[Number(listeDesIndices[k])];
      rien = generatedBin[Number(listeDesIndices[k])];
      rien;

      if (
        binOriginal[Number(listeDesIndices[k])] !=
        generatedBin[Number(listeDesIndices[k])]
      ) {
        return false;
      } else {
      }
    }
    return true;
  }

  function generateBinaire(minterme) {
    //minterme = "a'bc'de'";
    var listeMinterme = [];

    var BinaryMintermeEnArray = new Array(NumberOfVars);
    BinaryMintermeEnArray;

    for (var g = 0; g < BinaryMintermeEnArray.length; g++) {
      BinaryMintermeEnArray[g] = "0";
    }

    var BinaryMinterme;
    BinaryMintermeEnArray;
    listeMinterme = minterme.split("");
    listeMinterme;
    var index = 0;
    var sortedARR;

    for (var g = 0; g < listeMinterme.length; g++) {
      if (listeMinterme[g] != "'") {
        chhhh = listeMinterme[g];

        TempContientTouteVariables;
        sortedARR = TempContientTouteVariables.split("");
        sortedARR = sortedARR.sort();
        sortedARR;
        TempContientTouteVariables = sortedARR.join("");
        console.log(TempContientTouteVariables);
        if (isLetter(listeMinterme[g]) && listeMinterme[g + 1] == "'") {
          index = TempContientTouteVariables.indexOf(listeMinterme[g]);
          index;
          BinaryMintermeEnArray[index] = "0";
        } else {
          index = TempContientTouteVariables.indexOf(listeMinterme[g]);
          index;
          BinaryMintermeEnArray[index] = "1";
        }
      }
    } // fin du grande boocle .
    BinaryMinterme = BinaryMintermeEnArray.join("");
    BinaryMinterme;
    return BinaryMinterme;
  }

  function removeSpaces(array) {
    for (var i = 0; i < array.length; i++) {
      array[i] = array[i].trim();
    }
  }

  function allVariables(expression) {
    var listDesChars = expression.split("");
    var VarsInExp = [];
    for (var i in listDesChars) {
      if (isLetter(listDesChars[i]) && !VarsInExp.includes(listDesChars[i])) {
        VarsInExp.push(listDesChars[i]);
      }
    }
    return VarsInExp;
  }

  function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
  }
  var tabDesMintermes = expression.split("+");
  tabDesMintermes;
  removeSpaces(tabDesMintermes);
  tabDesMintermes;
  var listDesChar = [];
  var allVArs = [];
  allVArs.push(allVariables(expression)); // [allVariables(expression),order]
  allVArs.sort();
  var nbrOfMonomes = tabDesMintermes.length;
  var fixedExpression = tabDesMintermes.join("+");
  console.log(fixedExpression);
  var TempContientTouteVariables = allVArs[0].join("");
  TempContientTouteVariables;
  var all = TempContientTouteVariables.length; // to be used later.
  all;
  nbrOfMonomes;
  //  #### to be used later nchlh :: ####   TempContientTouteVariables.indexOf("a");
  var NumberOfVars = allVArs[0].length; // numero des variables .
  NumberOfVars;
  tabDesMintermes;

  var minterme;
  var MintermeEnArray = [];
  //for (var i in tabDesMintermes) {  // boucle pour chaque minterme le put in a liste. // for (var i in tabDesMintermes)
  minterme = tabDesMintermes[0];

  MintermeEnArray = minterme.split("");

  MintermeEnArray;
  minterme = "a'c'd";
  var BinaryMintermeOfficiel;
  BinaryMintermeOfficiel = generateBinaire(minterme);
  BinaryMintermeOfficiel;

  function extracteIndices(minterm) {
    var LesIndicesImp = []; // var qui contient les indices de chaque minterme.
    var listeDeMintermeWithoutApostroph = allVariables(minterm);
    for (var k in listeDeMintermeWithoutApostroph) {
      LesIndicesImp.push(
        TempContientTouteVariables.indexOf(listeDeMintermeWithoutApostroph[k])
      );
      LesIndicesImp;
    }
    return LesIndicesImp;
  }
  var binary = "100000";
  var digit = parseInt(binary, 2);
  digit;

  var arrayDesBinaires = [];

  finalBoss(arrayDesBinaires);

  function finalBoss(arrayDesBinaires) {
    var IterMinterme = "b'cd";
    var iterbinaireMin;
    var iterIndices;
    //var temp ;
    var digit;
    var iterBinaireNum;
    var islam = [];
    for (var m = 0; m < tabDesMintermes.length; m++) {
      IterMinterme = tabDesMintermes[m];
      iterbinaireMin;
      iterbinaireMin = generateBinaire(IterMinterme);
      console.log(tabDesMintermes[m]);
      iterbinaireMin;
      iterIndices = extracteIndices(IterMinterme);
      iterIndices;
      digit = parseInt(iterbinaireMin, 2);
      digit;
      for (var i = digit; i <= Math.pow(2, NumberOfVars) - 1; i++) {
        //console.log(i)
        i;
        iterBinaireNum = i.toString(2);

        while (iterBinaireNum.length < NumberOfVars) {
          iterBinaireNum = "0" + iterBinaireNum;
        }

        if (comparaison(iterbinaireMin, iterIndices, iterBinaireNum)) {
          arrayDesBinaires.push(iterBinaireNum);
          islam.push(i);
        } else {
        }
      } // boucle des i=0 jusque 2**n des canonical functs .
    }
    // main boocle for : that goes once for each minterme .
    islam = islam.sort();
    console.log(islam);
  } // fin fonction
  arrayDesBinaires;
  var nbbb = arrayDesBinaires.length;
  nbbb;
  console.log(arrayDesBinaires);
  // remove duplicates from .
  let cleanArrayOfMintermesEnBinaires = [...new Set(arrayDesBinaires)];
  // section pour les tests.
  //
  //
  //
  // ab + c'd ==>  abcd , abc'd' , a'b'c'd , ab'c'd , a'bc'd , abc'd
  //expression = " ab + c'd ";
  /////////////////////////////////////////////////////////////////
  cleanArrayOfMintermesEnBinaires;
  console.log(cleanArrayOfMintermesEnBinaires);
  digit = cleanArrayOfMintermesEnBinaires.length;
  digit;

  //
  //
  //

  return cleanArrayOfMintermesEnBinaires;
}

var sys = main("A+BCD+BCD+B'C'");
sys;

// function main(expression) {
//   tabDesMintermes = expression.split("+");
//   removeSpaces(tabDesMintermes); //[AB,C'D,E]
//   listDesChar = [];
//   allVArs = [];
//   allVArs.push(allVariables(expression));
//   allVArs.sort();
//   TempContientTouteVariables = allVArs[0].join("");
//   TempContientTouteVariables; // to be used later.
//   //  #### to be used later nchlh :: ####   TempContientTouteVariables.indexOf("a");
//   NumberOfVars = allVArs[0].length; // nombre de variables .

//   tabDesMintermes;
//   var minterme;
//   var MintermeEnArray = [];
//   //for (var i in tabDesMintermes) {  // boucle pour chaque minterme le put in a liste. // for (var i in tabDesMintermes)
//   minterme = tabDesMintermes[0];

//   MintermeEnArray = minterme.split("");

//   MintermeEnArray;
//   minterme = "a'c'd";
//   var BinaryMintermeOfficiel;
//   BinaryMintermeOfficiel = generateBinaire(minterme);
//   BinaryMintermeOfficiel;

//   var arrayDesBinaires = [];
//   finalBoss(arrayDesBinaires);
//   arrayDesBinaires;
//   // remove duplicates from .
//   let cleanArrayOfMintermesEnBinaires = [...new Set(arrayDesBinaires)];
//   // section pour les tests .

//   // ab + c'd ==>  abcd , abc'd' , a'b'c'd , ab'c'd , a'bc'd , abc'd
//   expression = " ab + c'd ";
//   cleanArrayOfMintermesEnBinaires;
//   var reponse = comparaison("0000", "13", "00000");
//   reponse;
//   return cleanArrayOfMintermesEnBinaires;
// }
function displayInput(str) {
  let input = document.createElement("div");
  input.id = "entree";
  let expr = str.replace(/.{60}/g, "$& ");
  input.innerText = `${expr}`;
  document.querySelector(".fonction").appendChild(input);
}
function sum(arr) {
  //C'est juste
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == "1") sum++;
  }
  return sum;
}
class Groupe {
  Minterm2 = [];
  Minterm10 = [];
  PrimeImplicant = [];
  Esum = [];
}
class PrimeChart {
  minterms;
  CorrespondingPrimes = [];
}
function Creation(str, dontcares) {
  //A fin de créer nos groupes
  if (dontcares != null && dontcares.length > 0) {
    for (let i = 0; i < dontcares.length; i++) {
      if (!str.includes(dontcares[i])) {
        str.push(dontcares[i]);
      }
    }
  }

  let Tab2 = [];
  for (let i = 0; i < str.length; i++) {
    let k = sum(str[i]);
    if (Tab2[k] == null) {
      let g = new Groupe();
      let m1 = [];
      m1.push(parseInt(str[i], 2));
      g.Minterm2.push(str[i]);
      g.Minterm10.push(m1);
      g.PrimeImplicant.push(false);
      g.Esum.push(0);
      Tab2[k] = g;
    } else {
      Tab2[k].Minterm2.push(str[i]);
      let m1 = [];
      m1.push(parseInt(str[i], 2));
      Tab2[k].Minterm10.push(m1);
      Tab2[k].PrimeImplicant.push(false);
      Tab2[k].Esum.push(0);
    }
  }
  m1 = null;
  let gr = new Array();
  for (i = 0; i < Tab2.length; i++) {
    if (Tab2[i] != null) gr.push(Tab2[i]);
  }
  Tab2 = null;
  return gr;
}
function isPowerofTwo(n) {
  if (n == 0) return false;
  if ((n & ~(n - 1)) == n) return true;
  return false;
}
function Comparer2(m1, m2) {
  //Effectuer la comparaison entre les tableaux qui contient les bits (Minterm2)
  let ch = "";
  let differ = 0;
  for (let i = 0; i < m1.length; i++) {
    if (m1[i] != m2[i]) {
      if (differ > 1) {
        return null;
      }
      ch += "_";
      differ++;
    } else ch += m1[i];
  }
  if (differ == 1) {
    return ch;
  }
  return null;
}
function Comparer(g1, g2) {
  let correspond;
  let result = null;
  let m10 = [];
  let m2 = [];
  let prime2 = 0;
  for (let i = 0; i < g1.Minterm10.length; i++) {
    let gm1 = g1.Minterm10[i];
    for (let j = 0; j < g2.Minterm10.length; j++) {
      let gm2 = g2.Minterm10[j];
      if (g1.Esum[i] == g2.Esum[j] && isPowerofTwo(gm2[0] - gm1[0])) {
        m2 = Comparer2(g1.Minterm2[i], g2.Minterm2[j]);
        if (m2 != null) {
          if (result == null) {
            result = new Groupe();
          }
          result.Minterm2.push(m2);
          g1.PrimeImplicant[i] = true;
          g2.PrimeImplicant[j] = true;
          arr3 = g1.Minterm10[i].concat(g2.Minterm10[j]);
          result.Minterm10.push(arr3);
          result.PrimeImplicant.push(false);
          result.Esum.push(g1.Esum[i] + gm2[0] - gm1[0]);
        }
      }
    }
    if (g1.PrimeImplicant[i] == false) {
      if (PremierImpliquant == null) {
        PremierImpliquant = new Groupe();
      }
      PremierImpliquant.Minterm2.push(g1.Minterm2[i]);
      PremierImpliquant.Minterm10.push(g1.Minterm10[i]);
      PremierImpliquant.Esum.push(g1.Esum[i]);
      prime2++;
      /* g1.PrimeImplicant.splice(i, 1);
      g1.Minterm10.splice(i, 1);
      g1.Minterm2.splice(i, 1);
      g1.Esum.splice(i, 1);
      i--;*/
    }
  }
  correspond = prime2 == g1.Minterm2.length;
  if (result != null) {
    for (let i = 0; i < result.Minterm10.length; i++) {
      for (let j = i + 1; j < result.Minterm10.length; j++) {
        if (
          result.Esum[i] == result.Esum[j] &&
          result.Minterm10[i][0] == result.Minterm10[j][0] &&
          result.Minterm10[i][result.Minterm10[i].length - 1] ==
            result.Minterm10[j][result.Minterm10[j].length - 1]
        ) {
          result.Minterm10.splice(j, 1);
          result.Esum.splice(j, 1);
          result.PrimeImplicant.splice(j, 1);
          result.Minterm2.splice(j, 1);
          j--;
        }
      }
    }
    prime2 = null;
    g1.Minterm2 = result.Minterm2;
    g1.Minterm10 = result.Minterm10;
    g1.PrimeImplicant = result.PrimeImplicant;
    g1.Esum = result.Esum;
  }
  return !correspond;
}
function tableComponent() {
  var newDiv = document.createElement("div");
  var newTable = document.createElement("table");
  var newTr = document.createElement("tr");
  var newTh = document.createElement("th");
  var newTd = document.createElement("td");
  newDiv.appendChild(newTable);
  newTable.appendChild(newTr);
  newTr.appendChild(newTh);
  newTr.appendChild(newTd);
  newTh.innerHTML = "Groupes";
  newTd.innerHTML = "Mintermes";
  return newDiv;
}
function rowComponent(val) {
  var newTr = document.createElement("tr");
  var newTh = document.createElement("th");
  var newTd = document.createElement("td");
  newTr.appendChild(newTh);
  newTr.appendChild(newTd);
  newTh.innerHTML = `Groupe ${val}`;
  return newTr;
}
function bodyComponent(gr) {
  var tables = document.getElementById("tables");
  var newDiv = tableComponent();
  var table = newDiv.getElementsByTagName("table")[0];
  tables.appendChild(newDiv);
  for (let j = 0; j < gr.length; j++) {
    table.appendChild(rowComponent(j));
    var td = table
      .getElementsByTagName("tr")
      [j + 1].getElementsByTagName("td")[0];
    for (let i = 0; i < gr[j].gm2.length; i++) {
      if (i > 0) {
        let newSpan = document.createElement("span");
        newSpan.innerHTML = "<br/>";
        td.appendChild(newSpan);
      }
      td.appendChild(mintermComponent(`${gr[j].gm2[i]}`, gr[j].gm10[i]));
    }
  }
}
function mintermComponent(val, i) {
  var newDiv = document.createElement("div");
  var newDiv1 = document.createElement("div");
  var newDiv2 = document.createElement("div");
  newDiv.appendChild(newDiv1);
  newDiv.appendChild(newDiv2);
  newDiv.className = "indice-binaire";
  newDiv1.className = "indice";
  newDiv2.className = "binaire";
  newDiv1.innerHTML = `M${i}`;
  newDiv2.innerHTML = val;
  return newDiv;
}
function rowDominanceTrace(tab1, tab2, tab3, txt, tab4) {
  //tab1:tableau des implicants tab2:tableau des noms des implicants ex:M01,M02...
  let tab = document.createElement("div");
  tab.id = "primesTable";
  let table = createTable(txt);
  tab.appendChild(table);
  let firstLine = premiereLigne(tab1);
  table.getElementsByClassName("scroll")[0].appendChild(firstLine);
  for (let i = 0; i < tab2.length; i++) {
    let colonne = colonnes(tab2[i].minterms, tab1.length, tab4[i]);
    for (let k = 0; k < tab3.length; k++) {
      if (i === tab3[k]) {
        colonne.style.backgroundColor = "pink";
      }
      table.getElementsByClassName("scroll")[0].appendChild(colonne);
    }
  }
  document.getElementById("impliquantsEssentiels").appendChild(tab);
}

function columnDominanceTrace(tab1, tab2, tab3, txt, tab4) {
  //tab1:tableau des implicants tab2:tableau des noms des implicants ex:M01,M02...
  let tab = document.createElement("div");
  tab.id = "primesTable";
  let table = createTable(txt);
  tab.appendChild(table);
  let firstLine = premiereLigne(tab1);
  table.getElementsByClassName("scroll")[0].appendChild(firstLine);
  for (let i = 0; i < tab2.length; i++) {
    let colonne = colonnesForColumnDominanceTrace(
      tab2[i].minterms,
      tab1.length,
      tab4[i],
      tab3
    );
    table.getElementsByClassName("scroll")[0].appendChild(colonne);
  }
  document.getElementById("impliquantsEssentiels").appendChild(tab);
}

function colonnesForColumnDominanceTrace(val, nb, tab, tab3) {
  //creer une colonne avec nb cases
  let tr = document.createElement("tr");

  let table = document.createElement("td");
  tr.appendChild(table);
  let mintermes = document.createElement("div");
  mintermes.classList.add("minterms");
  table.appendChild(mintermes);
  let div = document.createElement("div");
  div.classList.add("minterm");
  div.innerText = `M${val}`; //le numero du minterm ex: M01
  mintermes.appendChild(div);
  for (let i = 0; i < nb; i++) {
    let x = document.createElement("td");
    for (let k = 0; k < tab3.length; k++) {
      if (i === tab3[k]) {
        x.style.backgroundColor = "#5c38ff";
      }
      if (tab[i] == true) {
        x.innerText = "X";
      }
      tr.appendChild(x);
    }
  }
  return tr;
}

//Prime implicants tables implementation
function premiereLigne(tab) {
  //creer la premiere ligne avec tab.length implicants
  let table = document.createElement("tr");
  let mintermes = document.createElement("th");
  table.appendChild(mintermes);
  mintermes.innerText = "Minterms";
  for (let i = 0; i < tab.length; i++) {
    let td = document.createElement("td");
    td.classList.add("td");
    let newDiv = document.createElement("div");
    newDiv.classList.add("primeImplicants");
    let div = document.createElement("div");
    div.classList.add("primeImplicant");
    div.innerText = tab[i];
    newDiv.appendChild(div);
    td.appendChild(newDiv);
    table.appendChild(td);
  }
  return table;
}
function colonnes(val, nb, tab) {
  //creer une colonne avec nb cases
  let tr = document.createElement("tr");

  let table = document.createElement("td");
  tr.appendChild(table);
  let mintermes = document.createElement("div");
  mintermes.classList.add("minterms");
  table.appendChild(mintermes);
  let div = document.createElement("div");
  div.classList.add("minterm");
  div.innerText = `M${val}`; //le numero du minterm ex: M01
  mintermes.appendChild(div);

  for (let i = 0; i < nb; i++) {
    let x = document.createElement("td");
    if (tab[i] == true) {
      x.innerText = "X";
    }
    tr.appendChild(x);
  }
  return tr;
}
function createTable(txt) {
  let div = document.createElement("div");
  let newDiv = document.createElement("div");
  newDiv.classList.add("message");
  newDiv.innerText = txt;
  let t = document.createElement("table");
  t.classList.add("primesTable");
  div.appendChild(newDiv);
  div.appendChild(t);
  let b = document.createElement("tbody");
  b.classList.add("scroll");
  t.appendChild(b);
  return div;
}
function primeTrace(tab1, tab2, txt, tab3) {
  //tab1:tableau des implicants tab2:tableau des noms des implicants ex:M01,M02...
  let tab = document.createElement("div");
  tab.id = "primesTable";
  let table = createTable(txt);
  tab.appendChild(table);
  let firstLine = premiereLigne(tab1);
  table.getElementsByClassName("scroll")[0].appendChild(firstLine);
  for (let i = 0; i < tab2.length; i++) {
    let colonne = colonnes(tab2[i].minterms, tab1.length, tab3[i]);
    table.getElementsByClassName("scroll")[0].appendChild(colonne);
  }
  document.getElementById("impliquantsEssentiels").appendChild(tab);
}
function colonnesEssentiel1(val, nb, tab, tab3, l) {
  //creer une colonne avec nb cases
  let tr = document.createElement("tr");

  let table = document.createElement("td");
  tr.appendChild(table);
  let mintermes = document.createElement("div");
  mintermes.classList.add("minterms");
  table.appendChild(mintermes);
  let div = document.createElement("div");
  div.classList.add("minterm");
  div.innerText = `M${val}`; //le numero du minterm ex: M01
  mintermes.appendChild(div);
  for (let i = 0; i < nb; i++) {
    let x = document.createElement("td");
    if (tab[i] == true) {
      x.innerText = "X";
      console.log(l.length);
      if (l.length != 0) {
        for (let k = 0; k < l.length; k++) {
          if (tab3[l[k]].indice == i) {
            x.style.backgroundColor = "#63C884";
          }
        }
      }
    }
    tr.appendChild(x);
  }
  return tr;
}
function colonnesEssentiel2(val, nb, tab) {
  //creer une colonne avec nb cases
  let tr = document.createElement("tr");

  let table = document.createElement("td");
  tr.appendChild(table);
  let mintermes = document.createElement("div");
  mintermes.classList.add("minterms");
  table.appendChild(mintermes);
  let div = document.createElement("div");
  div.classList.add("minterm");
  div.innerText = `M${val}`; //le numero du minterm ex: M01
  mintermes.appendChild(div);
  for (let i = 0; i < nb; i++) {
    let x = document.createElement("td");
    if (tab[i] == true) {
      x.innerText = "X";
    }
    tr.appendChild(x);
  }
  return tr;
}
function essentielTrace(tab1, tab2, tab3, txt, tab4) {
  //tab1:tableau des implicants tab2:tableau des noms des implicants ex:M01,M02...
  var possible = false;
  let tab = document.createElement("div");
  tab.id = "primesTable";
  let table = createTable(txt);
  tab.appendChild(table);
  let firstLine = premiereLigne(tab1);
  table.getElementsByClassName("scroll")[0].appendChild(firstLine);
  for (let k = 0; k < tab2.length; k++) {
    possible = false;
    for (let j = 0; j < tab3.length; j++) {
      if (tab3[j].i == k) {
        var l = [];
        l.push(j);
        possible = true;
      }
    }
    if (possible) {
      var colonne = colonnesEssentiel1(
        tab2[k].minterms,
        tab1.length,
        tab4[k],
        tab3,
        l
      );
    } else {
      var colonne = colonnesEssentiel2(tab2[k].minterms, tab1.length, tab4[k]);
    }
    table.getElementsByClassName("scroll")[0].appendChild(colonne);
  }
  document.getElementById("impliquantsEssentiels").appendChild(tab);
}
function findingRowIndices() {
  let rowIndice = [];
  for (let i = 0; i < chart.length; i++) {
    for (let j = i + 1; j < chart.length; j++) {
      if (Row(i, j)) {
        rowIndice.push(j);
        break;
      } else {
        if (Row(j, i)) {
          rowIndice.push(i);
          break;
        }
      }
    }
  }

  return rowIndice;
}
function findingColumnIndices() {
  let columnIndice = [];
  for (let i = 0; i < PremierImpliquant.Minterm2.length; i++) {
    for (let j = i + 1; j < PremierImpliquant.Minterm2.length; j++) {
      if (Column(i, j)) {
        columnIndice.push(i);
        break;
      } else {
        if (Column(j, i)) {
          columnIndice.push(j);
          break;
        }
      }
    }
  }
  return columnIndice;
}
function Trace() {
  for (let i = 0; i < tGroupe.length; i++) {
    bodyComponent(tGroupe[i]);
  }
  tGroupe = null;
}
function trace() {
  let i = 0;
  primeTrace(
    tPremier[0].p,
    tPremier[0].chart2,
    "La charte des premiers impliquants",
    tPremier[0].g
  );
  while (i < tPremier.length) {
    switch (tPremier[i].id) {
      case "essentiel":
        primeTrace(
          tPremier[i].p,
          tPremier[i].chart2,
          "La charte actuelle",
          tPremier[i].g
        );
        //primeTrace2(tPremier[i].p, tPremier[i].chart2, "msg");
        essentielTrace(
          tPremier[i].p,
          tPremier[i].chart2,
          tPremier[i].s,
          "charte des impliquants essentiels",
          tPremier[i].g
        );
        tPremier[i] = null;
        break;
      case "row":
        if (tPremier[i].chart2.length < 350) {
          primeTrace(
            tPremier[i].p,
            tPremier[i].chart2,
            "La charte actuelle",
            tPremier[i].g
          );
          rowDominanceTrace(
            tPremier[i].p,
            tPremier[i].chart2,
            tPremier[i].s,
            "Appliquons la dominance des lignes",
            tPremier[i].g
          );
          tPremier[i] = null;
        }

        break;
      case "column":
        primeTrace(
          tPremier[i].p,
          tPremier[i].chart2,
          "La charte actuelle",
          tPremier[i].g
        );
        columnDominanceTrace(
          tPremier[i].p,
          tPremier[i].chart2,
          tPremier[i].s,
          "Appliquons la dominance des colonnes",
          tPremier[i].g
        );
        tPremier[i] = null;

        break;
    }
    i++;
  }
}

function findingUniqueMinterms() {
  //Générer les implicants essentielles d'aprés la matrice
  let indice = -1;
  let implicantsTab = [];
  for (let i = 0; i < chart.length; i++) {
    let findingessentiel = 0;
    for (let j = 0; j < chart[i].CorrespondingPrimes.length; j++) {
      if (chart[i].CorrespondingPrimes[j] == true) {
        if (findingessentiel == 1) {
          findingessentiel++;
          break;
        }
        findingessentiel++;
        indice = j;
      }
    }
    if (findingessentiel == 1) {
      implicantsTab.push({ i, indice });
      //On est tombé sur un implicant essentielle
    }
  }
  return implicantsTab;
}

function Prime_implicants(minterms, dontcares) {
  //La fonction principale qui génére les premiers implicants
  if (minterms == null || minterms.length == 0) {
    //alert("Please enter the minterms");
    return;
  }
  let gr = new Array();
  let prime = 0;
  let cpt = 0;
  gr = Creation(minterms, dontcares);
  if (cpt < 3 && gr.length) {
    let gr1 = [];
    for (let i = 0; i < gr.length; i++) {
      let gm2 = [...gr[i].Minterm2];
      let gm10 = [...gr[i].Minterm10];
      let g = { gm2, gm10 };
      gr1.push(g);
    }
    tGroupe.push(gr1);
    cpt++;
  }

  let possible = true;
  let correspond;
  while (possible) {
    for (let i = 0; i < gr.length - 1; i++) {
      correspond = Comparer(gr[i], gr[i + 1]);
      if (!correspond) {
        prime++;
      }
    }
    if (prime == gr.length - 1) {
      possible = false;
    }
    for (let i = 0; i < gr[gr.length - 1].Minterm2.length; i++) {
      if (gr[gr.length - 1].PrimeImplicant[i] == false) {
        if (PremierImpliquant == null) {
          PremierImpliquant = new Groupe();
        }
        PremierImpliquant.Minterm2.push(gr[gr.length - 1].Minterm2[i]);
        PremierImpliquant.Minterm10.push(gr[gr.length - 1].Minterm10[i]);
        PremierImpliquant.Esum.push(gr[gr.length - 1].Esum[i]);
      }
    }
    gr.pop();
    //let newGroupement = false;
    if (possible && cpt < 3) {
      //bodyComponent(gr);
      let gr1 = [];
      for (let i = 0; i < gr.length; i++) {
        let gm2 = [...gr[i].Minterm2];
        let gm10 = [...gr[i].Minterm10];
        let g = { gm2, gm10 };
        gr1.push(g);
      }

      tGroupe.push(gr1);
      cpt++;
    }
    prime = 0;
  }
  gr = null;
  PremierImpliquant.Esum = null;
  let output1 = document.createElement("div");
  output1.id = "premier";

  let premiers = primeshow(PremierImpliquant);
  output1.innerText = ` ${premiers}`;
  let output2 = document.createElement("div");
  output2.innerText = ` ${premiers}`;
  output2.id = "premier";
  document.querySelector(".premier").appendChild(output1);
  document.querySelector(".premierT").appendChild(output2);
  return PremierImpliquant;
}
function primeshow(result) {
  //Afficher la derniére fonction simplifiée
  if (result == null || result.length == 0) return "";
  str = "";
  for (let i = 0; i < result.Minterm2.length; i++) {
    let ch = result.Minterm2[i];
    for (let j = 0; j < ch.length; j++) {
      if (ch[j] == "1") {
        str = str + String.fromCharCode("A".charCodeAt() + j);
      }
      if (ch[j] == "0") {
        str = str + String.fromCharCode("A".charCodeAt() + j) + "'";
      }
    }
    str = str + " ,";
  }
  str = str.slice(0, str.length - 1);

  return str;
}
function show() {
  //Afficher les premiers implicants générés
  str = "";
  alert("Your prime implicants are:");
  for (let i = 0; i < PremierImpliquant.Minterm2.length; i++) {
    let ch = PremierImpliquant.Minterm2[i];
    for (let j = 0; j < ch.length; j++) {
      if (ch[j] == "1") {
        str = str + String.fromCharCode("A".charCodeAt() + j);
      }
      if (ch[j] == "0") {
        str = str + String.fromCharCode("A".charCodeAt() + j) + "'";
      }
    }
    str = str + " | ";
  }
  alert(str);
}
function finalshow(result) {
  //Afficher la derniére fonction simplifiée
  if (result == null || result.length == 0) return "";
  str = "";
  for (let i = 0; i < result.Minterm2.length; i++) {
    let ch = result.Minterm2[i];
    for (let j = 0; j < ch.length; j++) {
      if (ch[j] == "1") {
        str = str + String.fromCharCode("A".charCodeAt() + j);
      }
      if (ch[j] == "0") {
        str = str + String.fromCharCode("A".charCodeAt() + j) + "'";
      }
    }
    str = str + " +";
  }
  str = str.slice(0, str.length - 1);

  return str;
}
function remove_duplicate() {
  //Supprimer les redondants
  if (PremierImpliquant == null) return;
  for (let i = 0; i < PremierImpliquant.Minterm2.length; i++) {
    for (let j = i + 1; j < PremierImpliquant.Minterm2.length; j++) {
      if (
        comparer(PremierImpliquant.Minterm2[i], PremierImpliquant.Minterm2[j])
      ) {
        PremierImpliquant.Minterm2.splice(j, 1);
        PremierImpliquant.Minterm10.splice(j, 1);
        j--;
      }
    }
  }
}
function comparer(m1, m2) {
  //basic one
  for (let i = 0; i < m1.length; i++) {
    if (m1[i] != m2[i]) return false;
  }
  return true;
}
function Chart(dontcares) {
  //Qui génére la matrice (Minterms;Premiers implicants)
  if (PremierImpliquant == null) return;
  let minterms = [];
  chart = [];
  //A fin de récupérer tous les mintermes
  for (let j = 0; j < PremierImpliquant.Minterm10.length; j++) {
    for (let k = 0; k < PremierImpliquant.Minterm10[j].length; k++) {
      if (!minterms.includes(PremierImpliquant.Minterm10[j][k])) {
        let found = false;
        //Pour supprimer tous les dontcares
        if (dontcares != null && dontcares.length > 0) {
          for (let l = 0; l < dontcares.length; l++) {
            if (
              parseInt(dontcares[l], 2) == PremierImpliquant.Minterm10[j][k]
            ) {
              found = true;
              break;
            }
          }
        }
        if (!found) minterms.push(PremierImpliquant.Minterm10[j][k]);
      }
    }
  }
  for (let i = 0; i < minterms.length; i++) {
    mint = new PrimeChart();
    mint.minterms = minterms[i];
    for (let j = 0; j < PremierImpliquant.Minterm2.length; j++) {
      if (PremierImpliquant.Minterm10[j].includes(minterms[i])) {
        mint.CorrespondingPrimes.push(true);
      } else mint.CorrespondingPrimes.push(false);
    }
    chart.push(mint);
  }
  minterms = null;
}
function EssentielPrimeImplicants() {
  //Générer les implicants essentielles d'aprés la matrice
  let Essentiel = false;
  let indice = -1;
  for (let i = 0; i < chart.length; i++) {
    let findingessentiel = 0;
    for (let j = 0; j < chart[i].CorrespondingPrimes.length; j++) {
      if (chart[i].CorrespondingPrimes[j] == true) {
        if (findingessentiel == 1) {
          findingessentiel++;
          break;
        }
        findingessentiel++;
        indice = j;
      }
    }
    if (findingessentiel == 1) {
      //On est tombé sur un implicant essentielle
      //colorier
      Essentiel = true;
      if (finalfunction == null) finalfunction = new Groupe();
      finalfunction.Minterm2.push(PremierImpliquant.Minterm2[indice]);
      finalfunction.Minterm10.push(PremierImpliquant.Minterm10[indice]);
      for (let k = 0; k < chart.length; k++) {
        if (PremierImpliquant.Minterm10[indice].includes(chart[k].minterms)) {
          chart.splice(k, 1);
          if (k <= i) i--;
          k--;
        } else {
          chart[k].CorrespondingPrimes.splice(indice, 1);
        }
      }
      PremierImpliquant.Minterm2.splice(indice, 1);
      PremierImpliquant.Minterm10.splice(indice, 1);
    }
  }
  return Essentiel;
}
function deleteEssentiel(tab) {
  console.log(tab);
  for (let i = 0; i < tab.length; i++) {
    if (finalfunction == null) finalfunction = new Groupe();
    finalfunction.Minterm2.push(PremierImpliquant.Minterm2[tab[i].indice]);
    finalfunction.Minterm10.push(PremierImpliquant.Minterm10[tab[i].indice]);
    for (let k = 0; k < chart.length; k++) {
      if (
        PremierImpliquant.Minterm10[tab[i].indice].includes(chart[k].minterms)
      ) {
        chart.splice(k, 1);
        k--;
      } else {
        chart[k].CorrespondingPrimes.splice(tab[i].indice, 1);
      }
    }
    for (let k = i + 1; k < tab.length; k++) {
      if (tab[k].indice > tab[i].indice) tab[k].indice--;
      else {
        if (tab[k].indice == tab[i].indice) {
          tab.splice(k, 1);
          k--;
        }
      }
      if (tab[k].i >= tab[i].i) tab[k].i--;
    }
    PremierImpliquant.Minterm2.splice(tab[i].indice, 1);
    PremierImpliquant.Minterm10.splice(tab[i].indice, 1);
  }
  return tab.length > 0;
}
function deleteRow(tab) {
  for (let i = 0; i < tab.length; i++) {
    chart.splice(tab[i], 1);
    for (let j = i + 1; j < tab.length; j++) {
      if (tab[j] >= tab[i]) tab[j]--;
    }
  }
  return tab.length > 0;
}
function deleteColumn(tab) {
  for (let i = 0; i < tab.length; i++) {
    for (let j = 0; j < chart.length; j++) {
      chart[j].ColumnDominance.splice(tab[i], 1);
    }
    for (let j = i + 1; j < tab.length; j++) {
      if (tab[j] >= tab[i]) tab[j]--;
    }
  }
  return tab.length > 0;
}
function PrimeChartMinimization() {
  //Réduire la taille de la matrice générer , en appliquant (Row+Column)Dominance
  if (PremierImpliquant == null || chart == null) return;
  let essentiel = true;
  let column = true;
  let row = true;
  let cpt1 = 0;
  let cpt2 = 0;
  let cpt3 = 0;
  while (essentiel || column || row) {
    let some = findingUniqueMinterms();
    if (some.length > 0 && cpt1 < 10) {
      if (chart.length > 0) {
        let chart2 = [];
        let g = [];
        for (let i = 0; i < chart.length; i++) {
          let g1 = [...chart[i].CorrespondingPrimes];
          g.push(g1);
          let g5 = { ...chart[i] };
          chart2.push(g5);
        }
        //let chart2 = [...chart];
        let s = [...some];
        let p = [...PremierImpliquant.Minterm2];
        let id = "essentiel";

        tPremier.push({ p, chart2, s, g, id });

        cpt1++;
      }
    }
    essentiel = EssentielPrimeImplicants();
    let some1 = findingRowIndices();
    if (some1.length > 0 && cpt2 < 10) {
      if (chart.length > 0) {
        let g = [];
        let chart2 = [];
        for (let i = 0; i < chart.length; i++) {
          let g1 = [...chart[i].CorrespondingPrimes];
          g.push(g1);
          let g2 = { ...chart[i] };
          chart2.push(g2);
        }
        let s = [...some1];
        let p = [...PremierImpliquant.Minterm2];
        let id = "row";
        tPremier.push({ p, chart2, s, g, id });
        cpt2++;
      }
    }
    row = RowDominance();
    let some2 = findingColumnIndices();
    if (some2.length > 0 && cpt3 < 10) {
      if (chart.length > 0) {
        let g = [];
        let chart2 = [];
        for (let i = 0; i < chart.length; i++) {
          let g1 = [...chart[i].CorrespondingPrimes];
          g.push(g1);
          let g7 = { ...chart[i] };
          chart2.push(g7);
        }
        let s = [...some2];
        let p = [...PremierImpliquant.Minterm2];
        let id = "column";
        tPremier.push({ p, chart2, s, g, id });
        cpt3++;
      }
    }
    column = ColumnDominance();
  }
  if (chart.length == 0) {
    res = finalshow(finalfunction);
    console.log(res);
    localStorage.setItem("exp", res.replace(/\s/g, ""));
    let resultat = document.createElement("div");
    resultat.id = "resultat";
    resultat.innerText = ` ${res}`;
    document.querySelector(".resultat").appendChild(resultat);

    let result = document.createElement("div");
    result.id = "resultat";
    result.innerText = ` ${res}`;
    document.querySelector(".fonctionT").appendChild(result);
    let output1 = document.createElement("div");
    output1.id = "premier";

    let ess = primeshow(finalfunction);
    output1.innerText = ` ${ess}`;
    let output2 = document.createElement("div");
    output2.innerText = ` ${ess}`;
    output2.id = "premier";
    document.querySelector(".essentiel").appendChild(output1);
    document.querySelector(".essentielT").appendChild(output2);
  } else {
    //alert("On Applique l'Algorithme de Petrick");
    //primeTrace(PremierImpliquant.Minterm2, chart, "Prime implicants chart");
    res = Petrick2();
    console.log("we are after petrick");
    localStorage.setItem("exp", res.replace(/\s/g, ""));
    let resultat = document.createElement("div");
    resultat.id = "resultat";
    console.log(res);
    resultat.innerText = `${res}`;
    document.querySelector(".resultat").appendChild(resultat);
    let result = document.createElement("div");
    result.id = "resultat";
    result.innerText = ` ${res}`;
    document.querySelector(".fonctionT").appendChild(result);
    let output1 = document.createElement("div");
    output1.id = "premier";
    //let ess = primeshow(finalfunction);
    output1.innerText = ` ${res}`;
    let output2 = document.createElement("div");
    output2.innerText = ` ${res}`;
    output2.id = "premier";
    document.querySelector("#etape3").querySelector("h5").innerText =
      "Les impliquants essentiels par Petrick :";
    document.querySelector(".essentiel").appendChild(output1);
    document.querySelector(".essentielT").appendChild(output2);
  }
}
const getExp = (exp) => {
  fetch("https://polar-ravine-24612.herokuapp.com/espresso", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    //mode: 'no-cors',
    body: JSON.stringify({
      exp: `${exp}`,
    }),
  }).then(async (data) => {
    const result = await data.json();
    const simp = result.exp;
    //const innerdiv = document.getElementById("result")
    //innerdiv.innerText = Your result is ${result.exp}
    localStorage.setItem("exp", simp.replace(/\s/g, ""));
    let resultat = document.createElement("div");
    resultat.id = "resultat";
    resultat.innerText = `${simp}`;
    document.querySelector(".resultat").appendChild(resultat);
    //console.log(result)
  });
};
function RowDominance() {
  //Appliquer la dominance des lignes
  let row = false;
  for (let i = 0; i < chart.length; i++) {
    for (let j = i + 1; j < chart.length; j++) {
      if (Row(i, j)) {
        //on supprime j
        //colorer la jeme ligne
        if (chart.length > 0) {
          /*primeTrace(
            PremierImpliquant.Minterm2,
            chart,
            "Prime implicants chart"
          );*/
        }
        /*rowDominanceTrace(
          PremierImpliquant.Minterm2,
          chart,
          j,
          "Appliquons la dominance des lignes"
        );*/
        row = true;
        chart.splice(j, 1);
        j--;
      } else {
        if (Row(j, i)) {
          //colorer ieme ligne
          /*if (chart.length > 0) {
            primeTrace(
              PremierImpliquant.Minterm2,
              chart,
              "Prime implicants chart"
            );
          }
          rowDominanceTrace(
            PremierImpliquant.Minterm2,
            chart,
            i,
            "Appliquons la dominance des lignes"
          );*/
          row = true;
          chart.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }
  return row;
}

function Row(i, j) {
  //Utiliser pour Appliquer la dominance des lignes
  let correspond = false;
  for (let k = 0; k < chart[i].CorrespondingPrimes.length; k++) {
    if (chart[i].CorrespondingPrimes[k] == true) {
      correspond = true;
      if (chart[j].CorrespondingPrimes[k] == false) return false;
    }
  }
  if (correspond) return true;
  return false;
}
function ColumnDominance() {
  //Appliquer la dominance des colonnes
  column = false;
  for (let j = 0; j < PremierImpliquant.Minterm2.length; j++) {
    for (let k = j + 1; k < PremierImpliquant.Minterm2.length; k++) {
      if (Column(j, k)) {
        //on supprime j
        //colorer la jeme colonne
        /*if (chart.length > 0) {
          primeTrace(
            PremierImpliquant.Minterm2,
            chart,
            "Prime implicants chart"
          );
        }
        columnDominanceTrace(
          PremierImpliquant.Minterm2,
          chart,
          j,
          "Appliquons la dominance des colonnes"
        );*/
        column = true;
        for (let l = 0; l < chart.length; l++) {
          chart[l].CorrespondingPrimes.splice(j, 1);
        }
        PremierImpliquant.Minterm2.splice(j, 1);
        PremierImpliquant.Minterm10.splice(j, 1);
        j--;
        break;
      } else {
        //colorer la keme colonne
        if (Column(k, j)) {
          /*if (chart.length > 0) {
            primeTrace(
              PremierImpliquant.Minterm2,
              chart,
              "Prime implicants chart"
            );
          }
          columnDominanceTrace(
            PremierImpliquant.Minterm2,
            chart,
            k,
            "Appliquons la dominance des colonnes"
          );
          */
          column = true;
          for (let l = 0; l < chart.length; l++) {
            chart[l].CorrespondingPrimes.splice(k, 1);
          }
          PremierImpliquant.Minterm2.splice(k, 1);
          PremierImpliquant.Minterm10.splice(k, 1);
          k--;
        }
      }
    }
  }
  return column;
}
function Column(j, k) {
  //Utiliser pour Appliquer la dominance des colonnes
  let correspond = false;
  for (let i = 0; i < chart.length; i++) {
    if (chart[i].CorrespondingPrimes[j] == true) {
      correspond = true;
      if (chart[i].CorrespondingPrimes[k] == false) return false;
    }
  }
  if (correspond) return true;
  return false;
}
function Petrick() {
  //L'algorithme de Petrick
  let P = [];
  let p = "";
  let finalresult = [];
  for (
    let i = 0;
    i < chart.length;
    i++ //Constructing P function P=(p1,p2,p3,p4,...,pn)
  ) {
    for (let j = 0; j < chart[i].CorrespondingPrimes.length; j++) {
      if (chart[i].CorrespondingPrimes[j] == true) {
        p += "P" + j + "+";
      }
    }
    P.push(p.slice(0, p.length - 1));
    p = "";
  }
  console.log(P);
  let more = true;
  while (more) {
    // Applying  (X+Z).(X+Y)=(X+Y.Z)
    more = false;
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        let result = Petrick_Comparaison(P[i], P[j]);
        if (result != null) {
          more = true;
          P[i] = PetrickHash(result);
          P.splice(j, 1);
          j--;
        }
      }
    }
  }
  p = P[0];
  for (let i = 1; i < P.length; i++) {
    try {
      p = AND(p, P[i]);
    } catch (err) {
      return Petrick2();
    }
  }
  for (
    let i = 0;
    i < P.length;
    i++ //Eliminate a.b+a.b=a.b
  ) {
    for (let j = i + 1; j < P.length; j++) {
      if (P[i] == P[j]) {
        P.splice(j, 1);
        j--;
      }
    }
  }
  let minimum = Number.MAX_SAFE_INTEGER;
  for (
    let i = 0;
    i < P.length;
    i++ //Finding the minimum cost for the function
  ) {
    if (numberofoperands(P[i]) < minimum) minimum = numberofoperands(P[i]);
  }
  let result = [];
  for (let i = 0; i < P.length; i++) {
    if (numberofoperands(P[i]) == minimum) {
      result.push(P[i]);
    }
  }
  P = null;
  for (
    let i = 0;
    i < result.length;
    i++ //Get the final implicants
  ) {
    finalresult.push(Petrickgetimplicant(result[i]));
  }
  finalresult = numberofvariables(finalresult);
  console.log(finalresult);
  let smth = "";
  let ch = finalshow(finalresult[0]);
  if (finalfunction != null) ch = finalshow(finalfunction) + "+" + ch;
  smth += ch;
  //console.log(Petrick2())
  return smth;
}
function Petrick2() {
  let tab = [];
  let finalresult = [];
  let chart2 = [];
  tab.length = PremierImpliquant.Minterm2.length;
  tab.fill(0, 0, tab.length);
  //filling the array
  for (let i = 0; i < chart.length; i++) {
    for (let j = 0; j < chart[i].CorrespondingPrimes.length; j++) {
      if (chart[i].CorrespondingPrimes[j] == true) {
        tab[j]++;
      }
    }
  }
  let stop = false;
  while (!stop) {
    console.log(tab.toString());
    let tab1 = PetrickMax(tab);
    let max = tab1[0];
    let maxin = tab1[1];
    console.log(max);
    console.log(maxin);
    console.log(PremierImpliquant.Minterm2[maxin]);
    if (max == 0) {
      stop = true;
    } else {
      for (let i = 0; i < chart.length; i++) {
        if (chart[i].CorrespondingPrimes[maxin] == true) {
          for (let k = 0; k < chart[i].CorrespondingPrimes.length; k++) {
            if (chart[i].CorrespondingPrimes[k] == true) {
              tab[k]--;
            }
          }
          chart.splice(i, 1);
          i--;
        } else chart[i].CorrespondingPrimes.splice(maxin, 1);
      }
      finalresult.push(PremierImpliquant.Minterm2[maxin]);
      PremierImpliquant.Minterm2.splice(maxin, 1);
      PremierImpliquant.Minterm10.splice(maxin, 1);
      tab.splice(maxin, 1);
    }
  }
  console.log(finalresult.toString());
  let ch = "";
  if (finalfunction != null) ch = finalshow(finalfunction) + "+";
  ch += PetrickShow(finalresult);
  return ch;
}
function PetrickShow(result) {
  let ch = "";
  let funct = "";
  for (let i = 0; i < result.length; i++) {
    ch = result[i];
    for (let j = 0; j < ch.length; j++) {
      if (ch[j] == "1" || ch[j] == "0") {
        funct += String.fromCharCode("A".charCodeAt() + j);
        if (ch[j] == "0") funct += "'";
      }
    }
    if (i + 1 < result.length) funct += "+";
  }
  return funct;
}
function PetrickMax(tab) {
  let max = 0;
  let maxind = -1;
  for (let i = 0; i < tab.length; i++) {
    if (tab[i] > 0 && tab[i] == max) {
      let ch1 = Petricknumofvargate(PremierImpliquant.Minterm2[i]);
      let ch2 = Petricknumofvargate(PremierImpliquant.Minterm2[maxind]);
      {
        if (ch1[0] < ch2[0]) maxind = i;
        else {
          if (ch1[0] == ch2[0] && ch1[1] < ch2[1]) maxind = i;
        }
      }
    } else {
      if (tab[i] > max) {
        max = tab[i];
        maxind = i;
      }
    }
  }
  return [max, maxind];
}
function Petricknumofvargate(ch) {
  let varia = 0;
  let gates = 0;
  for (let i = 0; i < ch.length; i++) {
    if (ch[i] == "1" || ch[i] == "0") {
      varia++;
      if (ch[i] == "0") gates++;
    }
  }
  gates += varia - 1;
  return [varia, gates];
}
function numberofvariables(finalresult) {
  //Pour Trouver l'expression minimale avec minimum de variables et de portes logiques.
  let minimalvar = Number.MAX_SAFE_INTEGER;
  let minimalgates = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < finalresult.length; i++) {
    obj = finalresult[i];
    let numofgates = 0;
    let numberofvar = 0;
    for (let l = 0; l < obj.Minterm2.length; l++) {
      let ch = obj.Minterm2[l];
      for (let k = 0; k < ch.length; k++) {
        if (ch[k] == "1" || ch[k] == "0") {
          numberofvar++;
          if (ch[k] == "0") numofgates++;
        }
      }
    }
    if (numberofvar > 1) numofgates += numberofvar - 1;
    if (numberofvar < minimalvar) {
      //Priority is given to the number of variables
      minimalvar = numberofvar;
      minimalgates = numofgates;
    } else {
      if (numberofvar > minimalvar) {
        finalresult.splice(i, 1);
        i--;
      } else {
        if (numofgates < minimalgates) minimalgates = numofgates;
        else {
          if (numofgates > minimalgates) {
            finalresult.splice(i, 1);
            i--;
          }
        }
      }
    }
  }
  for (
    let i = 0;
    i < finalresult.length;
    i++ //Vérification
  ) {
    let obj = finalresult[i];
    let numofgates = 0;
    let numberofvar = 0;
    for (let l = 0; l < obj.Minterm2.length; l++) {
      let ch = obj.Minterm2[l];
      for (let k = 0; k < ch.length; k++) {
        if (ch[k] == "1" || ch[k] == "0") {
          numberofvar++;
          if (ch[k] == "0") numofgates++;
        }
      }
    }
    if (numberofvar > 1) numofgates += numberofvar - 1;
    if (numberofvar > minimalvar) {
      finalresult.splice(i, 1);
      i--;
    } else {
      if (numofgates > minimalgates) {
        finalresult.splice(i, 1);
        i--;
      }
    }
  }
  return finalresult;
}
function numberofoperands(ch) {
  //Basice one
  let num = 0;
  for (let i = 0; i < ch.length; i++) {
    if (isOperand(ch[i])) num++;
  }
  return num;
}
function Petrick_Comparaison(P1, P2) {
  // Lorsque c'est possible,on effectue (X+Y).(X+Z)=(X+Y.Z)
  let tab1 = P1.split("+");
  let tab2 = P2.split("+");
  let essentiel = "";
  let p1 = "";
  let p2 = "";
  for (let i = 0; i < tab1.length; i++) {
    if (tab2.includes(tab1[i])) {
      essentiel += tab1[i] + "+";
      tab2.splice(tab2.indexOf(tab1[i]), 1);
      tab1.splice(i, 1);
      i--;
    }
  }
  if (essentiel.length == 0) return null;
  for (let i = 0; i < tab1.length; i++) {
    p1 += tab1[i] + "+";
  }
  p1 = p1.slice(0, p1.length - 1);
  for (let i = 0; i < tab2.length; i++) {
    p2 += tab2[i] + "+";
  }
  p2 = p2.slice(0, p2.length - 1);
  essentiel += AND(p1, p2);
  return essentiel;
}
function Petrick_getimplicant(ch) {
  //Récupérer l'implicant qui correspond (Relative à Petrick)
  let obj = new Groupe();
  for (let j = 0; j < ch.length; j++) {
    if (isOperand(ch[j])) {
      let indice = ch[j].charCodeAt() - "A".charCodeAt();
      obj.Minterm2.push(PremierImpliquant.Minterm2[indice]);
      obj.Minterm10.push(PremierImpliquant.Minterm10[indice]);
    }
  }
  return obj;
}
function Petrickgetimplicant(ch) {
  let obj = new Groupe();
  let tab = ch.split("P");
  for (let i = 0; i < tab.length; i++) {
    if (tab[i] != "") {
      let indice = parseInt(tab[i], 10);
      obj.Minterm2.push(PremierImpliquant.Minterm2[indice]);
      obj.Minterm10.push(PremierImpliquant.Minterm10[indice]);
    }
  }
  return obj;
}
function PetrickHash(s) {
  let tab = s.split(".");
  for (let i = 0; i < tab.length; i++) {
    for (let j = i + 1; j < tab.length; j++) {
      if (tab[i] == tab[j]) {
        tab.splice(j, 1);
        j--;
      }
    }
  }
  /*const sortAlphanum=(a, b)=>a.localeCompare(b,'en',{numeric:true})
  tab=tab.sort(sortAlphanum)*/

  return tab.toString().replaceAll(",", "");
}

//il manque la fonction de verification synthaxique

function get(k) {
  const myArray = k.split(",");
  var MinTerms = [];
  for (var i = 0; i < myArray.length; i++) {
    let x = myArray[i];
    let y = parseInt(x);
    //alert(y);
    let m = y.toString(2);
    //alert(m);
    MinTerms.push(m);
  }
  MinTerms.sort((a, b) => a.length - b.length);

  let nb = MinTerms[MinTerms.length - 1].length;
  for (let i = 0; i < MinTerms.length; i++) {
    while (MinTerms[i].length < nb) {
      MinTerms[i] = "0" + MinTerms[i];
    }
  }

  return MinTerms;
}
function get2(k, l) {
  ///for don't care ( npassiwlha comme 2eme paramètre get(k)[0].length par ex)
  const myArray = k.split(",");
  var MinTerms = [];

  for (var i = 0; i < myArray.length; i++) {
    let x = myArray[i];
    let y = parseInt(x);
    //alert(y);
    let m = y.toString(2);
    //alert(m);
    MinTerms.push(m);
  }
  MinTerms.sort((a, b) => a.length - b.length);

  let nb = l;
  for (let i = 0; i < MinTerms.length; i++) {
    while (MinTerms[i].length < nb) {
      MinTerms[i] = "0" + MinTerms[i];
    }
  }

  return MinTerms;
}
function get3(array1, array2) {
  ///for don't care ( npassiwlha comme 2eme paramètre get(k)[0].length par ex)
  let nb = 0;
  array1.sort((a, b) => a.length - b.length);
  array2.sort((a, b) => a.length - b.length);
  if (array1[array1.length - 1].length < array2[array2.length - 1].length) {
    nb = array2[array2.length - 1].length;
  } else {
    nb = array1[array1.length - 1].length;
  }
  for (let i = 0; i < array1.length; i++) {
    while (array1[i].length < nb) {
      array1[i] = "0" + array1[i];
    }
  }
  for (let i = 0; i < array2.length; i++) {
    while (array2[i].length < nb) {
      array2[i] = "0" + array2[i];
    }
  }
}

//the main
function getResult() {
  PremierImpliquant = null;
  chart = null; //Qui contient la matrice (Minterms(ligne),Corresponding Prime Implicants(colonne))
  finalfunction = null; //Qui contient le résultat final

  let str = localStorage.getItem("fonction"); //(A+B).(B+C)+A'.B+C+(A.(B+C)').C.D
  console.log("str = " + str);

  /*let tab =str.split(",");
  for (let i = 0; i < tab.length; i++) {
    tab[i]=tab[i]+ " "
  }
  str = tab.join(",")*/

  displayInput(str);
  if (str[0] >= "A" || str[0] === "(") {
    //verification synthaxique de l'expression
    let exp = disjonctiveTransform(str);
    const allVars = allVariables(exp);
    if (allVars.length < 10) {
      let tableau = main(exp);
      Prime_implicants(tableau);
      allVariables(exp);
      remove_duplicate();
      Chart();
      PrimeChartMinimization();
    } else {
      getExp(exp);
    }
  } else {
    //verification synthaxique de l'expression
    let DN = localStorage.getItem("dontcare");
    if (DN !== "") {
      DN = get(DN);
      let tableau = get(str);
      get3(tableau, DN);
      Prime_implicants(tableau, DN);
      //remove_duplicate();
      Chart(DN);
      PrimeChartMinimization();
    } else {
      let tableau = get(str);
      Prime_implicants(tableau);
      //remove_duplicate();
      Chart();
      //alert("Elhamdulah 1");
      PrimeChartMinimization();
      //alert("Elhamdulah 2");
      //console.log(Petrick2());
    }
  }
}
function addpoint(s) {
  let result = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] != " ") {
      result += s[i];
      if ((s[i] >= "A" && s[i] <= "Z") || (s[i] >= "a" && s[i] <= "z")) {
        if (i + 1 < s.length) {
          if (
            (s[i + 1] >= "A" && s[i + 1] <= "Z") ||
            (s[i + 1] >= "a" && s[i + 1] <= "z") ||
            s[i + 1] == "("
          ) {
            result += ".";
          }
        }
      } else {
        if (s[i] == "'" && i + 1 < s.length) {
          if (
            (s[i + 1] >= "A" && s[i + 1] <= "Z") ||
            (s[i + 1] >= "a" && s[i + 1] <= "z") ||
            s[i + 1] == "("
          ) {
            result += ".";
          }
        } else {
          if (s[i] == ")") {
            if (i + 1 < s.length) {
              if (
                (s[i + 1] >= "A" && s[i + 1] <= "Z") ||
                (s[i + 1] >= "a" && s[i + 1] <= "z")
              ) {
                result += ".";
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function logigramme(s) {
  s = s.trim();
  let ix = -1000;
  let iy = -1000;
  let xi = ix;
  let yi = iy;
  let or = false;
  let result =
    '{ "class": "go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray":[';
  let andg = 1;
  let org = 1;
  let not = 0;
  let x = [];
  let y = [];
  let tab = [];
  tab.length = 26;
  const pas = 10;
  let here = true;
  for (let i = 0; i < s.length; i++) {
    if ((s[i] >= "A" && s[i] <= "Z") || (s[i] >= "a" && s[i] <= "z")) {
      tab[s[i].charCodeAt() - "A".charCodeAt()] = 1;
    }
  }
  for (let i = 0; i < tab.length; i++) {
    if (tab[i] == 1) {
      result += '{"category":"input","key":"';
      result +=
        String.fromCharCode("A".charCodeAt() + i) +
        '","loc":"' +
        (xi - 500) +
        " " +
        (yi - 100) +
        '"},';
      yi += 100;
      xi -= 30;
    }
  }
  yi = iy;
  xi = ix;
  //Construction des portes logiques(leur positionnement)
  for (let i = 0; i < s.length; i++) {
    if (s[i] == ".") {
      result +=
        '{"category":"and","key":"and' +
        andg +
        '","loc":"' +
        xi +
        " " +
        yi +
        '"}';
      if (i + 2 < s.length || or) result += ",";
      xi += 300;
      andg++;
    } else {
      if (s[i] == "+") {
        x.push(xi - 300);
        y.push(yi);
        if (or) {
          result +=
            '{"category":"or", "key":"or' +
            org +
            '","loc":"' +
            (Math.max(x[0], x[1]) + 100) +
            " " +
            ((y[0] + y[1]) / 2 + 30) +
            '"},';
          org++;
          x.splice(0, 1);
          y.splice(0, 1);
        }
        xi = ix;
        yi += 200;
        or = true;
        here = true;
      } else {
        if (s[i] == "'") {
          if (i - 2 >= 0 && s[i - 2] == "+") {
            result +=
              '{"category":"not","key":"not' +
              not +
              '","loc":"' +
              (xi - 300) +
              " " +
              (yi - 50) +
              '"}';
          } else {
            if (i - 2 >= 0 && s[i - 2] == ".") {
              if (here) {
                result +=
                  '{"category":"not","key":"not' +
                  not +
                  '","loc":"' +
                  (xi - 450) +
                  " " +
                  (yi - pas + 50) +
                  '"}';
                here = false;
              } else {
                here = true;
                result +=
                  '{"category":"not","key":"not' +
                  not +
                  '","loc":"' +
                  (xi - 450) +
                  " " +
                  (yi + 50) +
                  '"}';
              }
            } else {
              if (i - 2 < 0 && i + 1 < s.length) {
                if (s[i + 1] == ".") {
                  result +=
                    '{"category":"not","key":"not' +
                    not +
                    '","loc":"' +
                    (xi - 150) +
                    " " +
                    (yi - 50) +
                    '"}';
                } else {
                  if (s[i + 1] == "+") {
                    result +=
                      '{"category":"not","key":"not' +
                      not +
                      '","loc":"' +
                      (xi - 300) +
                      " " +
                      (yi - 50) +
                      '"}';
                  }
                }
              }
            }
          }
          if (i + 2 < s.length || or) result += ",";
          not++;
        }
      }
    }
  }
  if (or) {
    x.push(xi - 300);
    y.push(yi);
    result +=
      '{"category":"or", "key":"or' +
      org +
      '","loc":"' +
      (Math.max(x[0], x[1]) + 100) +
      " " +
      ((y[0] + y[1]) / 2 + 30) +
      '"},';
    result +=
      '{"category":"output", "key":"output1' +
      '","loc":"' +
      (Math.max(x[0], x[1]) + 200) +
      " " +
      ((y[0] + y[1]) / 2 + 30) +
      '"}';
    x = [];
    y = [];
  } else {
    if (andg > 1 || not > 0) result += ",";
    result +=
      '{"category":"output", "key":"output1' +
      '","loc":"' +
      xi +
      " " +
      yi +
      '"}';
  }
  //Faire les liaisons entre les portes
  result += "]";
  result += ',"linkDataArray":[';
  let firstand = true;
  let firstor = true;
  let ngates = 0;
  let rgates = 0;
  not = 0;
  for (
    let i = 0;
    i < s.length;
    i++ //the input
  ) {
    if (s[i] == "+" || s[i] == "." || s[i] == "'") {
      if (s[i] == "'") {
        result += '{"from":"';
        result += s[i - 1];
        result += '","fromPort":"out","to":"not' + not + '","toPort":"in"},';
        not++;
      } else {
        if (s[i] == ".") {
          if (i - 2 >= 0) {
            if (s[i - 2] == "+") {
              result += '{"from":"';
              result += s[i - 1];
              result +=
                '","fromPort":"out","to":"and' +
                (ngates + 1) +
                '","toPort":"in1"},';
            } else {
              if (s[i - 2] == ".") {
                result += '{"from":"';
                result += s[i - 1];
                result +=
                  '","fromPort":"out","to":"and' +
                  ngates +
                  '","toPort":"in2"},';
              }
            }
          } else {
            result += '{"from":"';
            result += s[i - 1];
            result +=
              '","fromPort":"out","to":"and' +
              (ngates + 1) +
              '","toPort":"in1"},';
          }
          ngates++;
        } else {
          if (s[i] == "+") {
            if (i - 2 >= 0) {
              if (s[i - 2] == ".") {
                result += '{"from":"';
                result += s[i - 1];
                result +=
                  '","fromPort":"out","to":"and' +
                  ngates +
                  '","toPort":"in2"},';
              } else {
                if (s[i - 2] == "+") {
                  result += '{"from":"';
                  result += s[i - 1];
                  result +=
                    '","fromPort":"out","to":"or' +
                    rgates +
                    '","toPort":"in2"},';
                }
              }
            } else {
              result += '{"from":"';
              result += s[i - 1];
              result +=
                '","fromPort":"out","to":"or' +
                (rgates + 1) +
                '","toPort":"in1"},';
            }
            rgates++;
          }
        }
      }
    }
  }
  if ((s.length - 2 > 0 && s[s.length - 2] == "+") || s[s.length - 2] == ".") {
    if (s[s.length - 2] == "+") {
      result += '{"from":"';
      result += s[s.length - 1];
      result += '","fromPort":"out","to":"or' + rgates + '","toPort":"in2"},';
    } else if (s[s.length - 2] == ".") {
      result += '{"from":"';
      result += s[s.length - 1];
      result += '","fromPort":"out","to":"and' + ngates + '","toPort":"in2"},';
    }
  }
  ngates = 0;
  rgates = 1;
  not = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] == ".") {
      if (!firstand) {
        result +=
          '{"from":"and' +
          ngates +
          '","fromPort":"out","to":"and' +
          (ngates + 1) +
          '","toPort":"in1"},';
      } else firstand = false;
      ngates++;
    } else {
      if (s[i] == "+") {
        if (!firstor) {
          if (ngates > 0 && !firstand)
            result +=
              '{"from":"and' +
              ngates +
              '","fromPort":"out","to":"or' +
              rgates +
              '","toPort":"in2"},';
          rgates++;
        } else {
          if (ngates > 0 && !firstand)
            result +=
              '{"from":"and' +
              ngates +
              '","fromPort":"out","to":"or' +
              rgates +
              '","toPort":"in1"},';
          firstor = false;
        }
        firstand = true;
      } else {
        if (s[i] == "'") {
          result += '{"from":"not' + not + '","fromPort":"out","to":';
          if (i - 2 >= 0) {
            if (s[i - 2] == ".") {
              //join avec and
              result += '"and' + ngates + '","toPort":"in2"},';
            } else {
              if (s[i - 2] == "+") {
                if (i + 1 < s.length) {
                  if (s[i + 1] == "+") {
                    //join avec ou
                    result += '"or' + rgates + '","toPort":"in2"},';
                  } else {
                    if (s[i + 1] == ".") {
                      //join avec and+1
                      result += '"and' + (ngates + 1) + '","toPort":"in1"},';
                    }
                  }
                } else {
                  //join avec ou
                  result += '"or' + rgates + '","toPort":"in2"},';
                }
              }
            }
          } else {
            if (i + 1 < s.length) {
              if (s[i + 1] == "+") {
                //join avec ou
                result += '"or' + rgates + '","toPort":"in1"},';
              } else {
                if (s[i + 1] == ".") {
                  //join avec and+1
                  result += '"and' + (ngates + 1) + '","toPort":"in1"},';
                }
              }
            } else {
              result += '"output1","toPort":""}';
            }
          }
          not++;
        }
      }
    }
  }
  let orgates = 1;
  while (orgates < org) {
    result +=
      '{"from":"or' +
      orgates +
      '","fromPort":"out","to":"or' +
      (orgates + 1) +
      '","toPort":"in1"},';
    orgates++;
  }
  if (!firstor) {
    result +=
      '{"from":"or' +
      orgates +
      '","fromPort":"out","to":"output1' +
      '","toPort":""}';
    if (!firstand)
      result +=
        ',{"from":"and' +
        ngates +
        '","fromPort":"out","to":"or' +
        org +
        '","toPort":"in2"}';
  } else {
    if (!firstand)
      result +=
        '{"from":"and' +
        ngates +
        '","fromPort":"out","to":"output1' +
        '","toPort":""}';
  }
  result += "]}";
  return result;
}
window.addEventListener("DOMContentLoaded", () => {
  getResult();
  let afficher = false;
  let tr = false;
  let body = document.getElementById("body");
  let trac = document.getElementById("trace");
  let cacher = document.getElementById("cacher");
  let sidemenu = document.querySelectorAll(".btn");

  cacher.addEventListener("click", () => {
    body.style.display = "none";
    cacher.style.display = "none";
    afficher = false;
    for (let i = 0; i < sidemenu.length; i++) {
      sidemenu[i].style.display = "none";
    }
  });
  trac.addEventListener("click", () => {
    if (tr == false) {
      Trace();

      trace();
      tr = true;
      tPremier = null;
    }

    body.style.display = "block";
    afficher = true;
    if (afficher == true) {
      for (let i = 0; i < sidemenu.length; i++) {
        sidemenu[i].style.display = "block";
      }
    } else
      for (let i = 0; i < sidemenu.length; i++) {
        sidemenu[i].style.display = "none";
      }
  });
});
