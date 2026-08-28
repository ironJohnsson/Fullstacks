import { useState } from 'react'
import './App.css'

function App() {

    const [nome, setnome] = useState('');
    const[peso, setpeso] = useState('');
    const[altura, setaltura] = useState('');
    const[resultado, setresultado] = useState('');
    const[erro, seterro] = useState('');

    function classificarImc(imc){
        if(imc < 18.5){return "Abaixo do peso";} 
        else if( imc < 25){return "Peso normal";}
        else if(imc < 30){return "Sobrepeso";} 
        else if(imc <35){return "Obesidade 1";} 
        else if(imc < 40){return "Obesidade 2";}
        return "Obesidade 3"; 
        }
    
    function calcularImc(evento){
        evento.preventDefault();

        const pesoConvertido = Number(peso.replace(",", "."));
        const alturaConvertida = Number(altura.replace(",", "."));
        
        if(nome.trim() ===""|| pesoConvertido.toString().trim() <= 0 || alturaConvertida.toString().trim() <= 0){
            seterro("Preencha com valores válidos");
            setresultado("");
            return;
        }
        const imcCalculado = pesoConvertido / (alturaConvertida * alturaConvertida);
        setresultado({
            valor: imcCalculado.toFixed(2),
            classificacao: classificarImc(imcCalculado)
        });
        seterro("");
    }

    function limparCampos(){
        setnome("");
        setpeso("");
        setaltura("");
        setresultado("");
        seterro("");
    }


    return(

        <main>
            <h1>Calculadora de IMC</h1>
            <p className='Introducao'>informe seu peso e altura para calcular o imc</p>
            <form onSubmit={calcularImc}>
                <div classNome='campo'>
                    <input
                        id='nome'
                        type='text'
                        placeholder='Digite seu nome'
                        value={nome}
                        onChange={(evento)=> setnome(evento.target.value)}
                    />
                    
                    <input
                        id='peso'
                        type='text'
                        inputmode='decimal'
                        placeholder='Digite seu peso Ex: 86,5'
                        value={peso}
                        onChange={(evento)=> setpeso(evento.target.value)}
                    />

                    <input
                        id='altura'
                        type='text'
                        inputmode='decimal'
                        placeholder='Digite sua altura Ex: 1,75'
                        value={altura}
                        onChange={(evento)=> setaltura(evento.target.value)}
                    />

                    
                </div>

                <div className='botao'>
                    <button type='submit'>Calcular IMC</button>
                    <button type='button' onClick={limparCampos}>Limpar</button>
                </div>
                {erro && <p className='msgerro'>{erro}</p>}
                {resultado && (
                    <section className='resultado'>
                        <h2>Resultado</h2>
                        <br />
                        <p>Olá <strong>{nome}</strong>, seu IMC é: {resultado.valor}</p>
                        <br />
                        <p className='classificacao'>{resultado.classificacao}</p>
                    </section>
                )}

            </form>
        </main>

    );
}
export default App;