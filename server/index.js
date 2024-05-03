const http = require('http');
const { serveStatic } = require('./static.js');
const {
	ReasonPhrases,
	StatusCodes,
} = require('http-status-codes');
const db = require('./internal/database/database.js');
const respond = require('./response.js');
const port = process.env.PORT || 3000;

const routes = {
    '': (data, res) => {
      serveStatic({...data, path: 'public/index.html'}, res);
    },
    home: (data, res) => {
      res.writeHead(301, { Location: '/'});
      res.end();
    },
    cars: async (data, res) => {
      try {
        const id = (data.path.slice(5, 41));
        if (data.method === 'get') {
          if (id.length === 41) {
            const car = await db.getCar(res, id);
            if (!car) {
              respond.withError(res, StatusCodes.NOT_FOUND, 'No car is found');
              return;
            }
            respond.withJSON(res, StatusCodes.OK, car);
            return;
          }

          const cars = await db.getCars(res);
          respond.withJSON(res, StatusCodes.OK, cars);
        } else if (data.method === 'delete') {
          const deleted = await db.deleteCar(id);
          if (!deleted) {
            respond.withError(res, StatusCodes.NOT_FOUND, 'No car is found to be deleted');
            return;
          }

          respond.withJSON(res, StatusCodes.NO_CONTENT, ReasonPhrases.NO_CONTENT);
        } else {
          respond.withError(res, StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
        }
      } catch (err) {
        respond.withError(res, StatusCodes.INTERNAL_SERVER_ERROR, `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${err.message}`);
      }
    },
    about: async (data, res) => {
      if (data.url.pathname.length > '/about/'.length) {
        respond.withError(res, StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
      } else if (data.url.pathname.length > '/about'.length) {
        res.writeHead(301, { Location: '/about'});
        res.end();  
      } else {
        await serveStatic({...data, path: 'public/about.html'}, res);
      }
    },
    search: async (data, res) => {
      if (data.url.pathname.length > '/search/'.length) {
        respond.withError(res, StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
      } else if (data.url.pathname.length > '/search'.length) {
        res.writeHead(301, { Location: '/search'});
        res.end();  
      } else {
        await serveStatic({...data, path: 'public/search.html'}, res);
      }
    },
    notFound: (data, res) => {
      respond.withError(res, StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    }
};

http.createServer(async (req, res) => {
  try {
    let url = new URL(req.url, `http://localhost:${port}/`);
    const path = url.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const qs = url.search;
    const headers = req.headers;

    console.log(`${method} ${req.url}`);

    req.on('data', () => {
        // put some logic when data event is triggered
    });
    req.on('end', () => {
      // request part is finished
      const data = {
        url,
        path,
        queryString: qs,
        headers,
        method,
        buffer: ""
      };

      if (req.method === 'GET' && path.startsWith('public')) {
        serveStatic(data, res);
        return;
      }

      const route = typeof routes[path.split('/')[0]] !== 'undefined' ? routes[path.split('/')[0]] : routes['notFound'];
      route(data, res);
    });
  } catch (err) {
    res.end();
  }
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);