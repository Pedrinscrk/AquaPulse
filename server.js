require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const routes = require('./routes/index');

// REMOVIDO: const localtunnel = require('localtunnel');

const app = express();
const port = process.env.PORT || 1000;

let theme; // continua aqui pra usar depois

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use('/', routes);

// Nova função principal para lidar com a importação assíncrona
async function main() {
    // Importação Dinâmica do Chalk
    const { default: chalk } = await import('chalk');

    // Configuração de tema para logs
    theme = {
        header: chalk.hex('#00CED1').bold,
        success: chalk.hex('#7CFC00').bold,
        url: chalk.hex('#20B2AA').underline,
        local: chalk.hex('#FF69B4'),
        error: chalk.hex('#FF4500').bold,
        warning: chalk.hex('#FFD700'),
        divider: chalk.hex('#9370DB')
    };

    app.listen(port, '0.0.0.0', () => {
        console.log(`
${theme.divider('══════════════════════════════════════════════')}
${theme.header('   INICIANDO SISTEMA DE IRRIGAÇÃO AQUAPULSE  ')}
${theme.divider('══════════════════════════════════════════════')}
${theme.local(' Acesso Local:      ')} ${theme.url(`http://localhost:${port}`)}
${theme.divider('══════════════════════════════════════════════')}
        `);
    });
}

main().catch(console.error);
