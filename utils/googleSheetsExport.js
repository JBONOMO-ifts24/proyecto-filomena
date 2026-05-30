const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const Producto = require('../models/Producto');
const ModeloProducto = require('../models/ModeloProducto');
const Tipo_Producto = require('../models/Tipo_Producto');
const Imagen = require('../models/Imagen');

exports.ejecutarExportacion = async () => {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    
    // Fix private key parsing (remove extra surrounding quotes and fix newlines)
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    if (!sheetId || !clientEmail || !privateKey) {
      throw new Error('Faltan credenciales de Google Sheets en el archivo .env. Por favor configurá GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY.');
    }

    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo(); 
    
    // Escribir en la primera hoja
    const sheet = doc.sheetsByIndex[0];
    
    // Obtener los productos visibles
    const productos = await Producto.findAll({
      where: { visible: true },
      include: [
        {
          model: ModeloProducto,
          as: 'modelo',
          include: [
            {
              model: Tipo_Producto,
              as: 'tipo_producto'
            }
          ]
        },
        {
          model: Imagen,
          as: 'imagenes'
        }
      ],
      order: [['id', 'ASC']]
    });

    const domain = process.env.DOMAIN || 'https://tu-sitio-web.com'; // Necesario para links absolutos en Meta

    // Formatear la data según requerimientos de Meta Business
    const rows = productos.map(p => {
      // Buscar la imagen principal o la primera
      const imagenPrincipal = p.imagenes?.find(img => img.es_principal) || p.imagenes?.[0];
      const imageLink = imagenPrincipal ? `${domain}${imagenPrincipal.url}` : '';
      
      // Remover tags HTML de la descripción y espacios extra
      const descripcionLimpia = p.descripcion 
        ? p.descripcion.replace(/<[^>]+>/g, '').trim() 
        : '';

      return {
        'id': p.codigo, // SKU recomendado
        'title': p.nombre,
        'description': descripcionLimpia || p.nombre,
        'availability': p.cantidad > 0 ? 'in stock' : 'out of stock',
        'condition': 'new',
        'price': p.precio ? `${p.precio} ARS` : '', // Asumiendo ARS
        'link': `${domain}/producto/${p.id}`, // URL simulada, ajustar si la URL del frontend es diferente
        'image_link': imageLink,
        'brand': 'Filomena', // Marca predeterminada
        'google_product_category': p.modelo?.tipo_producto?.nombre || '',
        'fb_product_category': p.modelo?.tipo_producto?.nombre || '',
        'quantity_to_sell_on_facebook': p.cantidad,
        'sale_price': '',
        'sale_price_effective_date': '',
        'item_group_id': p.modeloProductoId ? p.modeloProductoId.toString() : '',
        'gender': '',
        'color': '',
        'size': '',
        'age_group': '',
        'material': '',
        'pattern': '',
        'shipping': '',
        'shipping_weight': '',
        'offer_disclaimer': '',
        'offer_disclaimer_url': '',
        'video[0].url': '',
        'video[0].tag[0]': '',
        'gtin': '',
        'product_tags[0]': '',
        'product_tags[1]': '',
        'style[0]': ''
      };
    });

    const headers = [
      'id', 'title', 'description', 'availability', 'condition', 'price', 'link', 
      'image_link', 'brand', 'google_product_category', 'fb_product_category', 
      'quantity_to_sell_on_facebook', 'sale_price', 'sale_price_effective_date', 
      'item_group_id', 'gender', 'color', 'size', 'age_group', 'material', 'pattern', 
      'shipping', 'shipping_weight', 'offer_disclaimer', 'offer_disclaimer_url', 
      'video[0].url', 'video[0].tag[0]', 'gtin', 'product_tags[0]', 'product_tags[1]', 'style[0]'
    ];

    // Limpiar hoja y setear encabezados
    await sheet.clear();
    await sheet.setHeaderRow(headers);
    
    if (rows.length > 0) {
      await sheet.addRows(rows);
    }

    return rows.length;
};
