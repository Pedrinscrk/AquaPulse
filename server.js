require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const routes = require('./routes/index');
const localtunnel = require('localtunnel');

const app = express();
const port = process.env.PORT || 1000;
const hostname = '0.0.0.0';

// Gerador de sufixo aleatório (4 dígitos)
const randomSuffix = () => Math.floor(Math.random() * 9000) + 1000;

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use('/', routes);

app.listen(port, hostname, async () => {
    console.log(`Servidor ONLINE em http://localhost:${port}`);

    try {
        const tunnel = await localtunnel({
            port: Number(port),
            subdomain: `aquapulse-${randomSuffix()}`, // Tentativa com sufixo
            local_host: hostname
        });

        console.log(`Link público: ${tunnel.url}`);

        // Se houver conflito no subdomínio, tentamos novamente sem especificar
        tunnel.on('error', async (err) => {
            if (err.message.includes('subdomain')) {
                console.log('⚠️ Subdomínio em uso, gerando novo túnel...');
                const newTunnel = await localtunnel({ port });
                console.log(`Novo link público: ${newTunnel.url}`);
            }
        });

        tunnel.on('close', () => {
            console.log('Túnel fechado');
        });

    } catch (error) {
        console.log('Erro no túnel:', error.message);
        // Fallback para subdomínio totalmente aleatório
        const fallbackTunnel = await localtunnel({ port });
        console.log(`Link alternativo: ${fallbackTunnel.url}`);
    }
});