/**
 * Created by 9I
 * @Date 2018/8/13
 * @description
 */
// const config = require('../../config')
// let _config = process.env.NODE_ENV === 'production' ? config.build : config.dev
// let host = 'http://' + _config.host + ':8089'http://192.168.1.135:7001/api/v1/common/login
const ApiUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.1.177:7001/api/v1' : 'http://192.168.1.104:7001/api/v1'
const baseUrl1 = ApiUrl + '/sample/'
const rootUrl1 = '/api'
const samplePreview = '/samplePreview'
const sampleDetail = '/sampleDetail'
const sampleSets = '/sampleSets'
const rootUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.1.177:7001/api/v1' : 'http://192.168.1.120:7001/api/v1'
const _socket = process.env.NODE_ENV === 'production' ? '/socket' : 'http://192.168.1.120:7001/io'
const _geocode = process.env.NODE_ENV === 'production' ? 'http://192.168.1.135/ime-server/rest/geocode/geo' : 'http://118.178.118.177/ime-server/rest/geocode/geo'
const _mapUrl = process.env.NODE_ENV === 'production' ? 'http://ditu.zjzwfw.gov.cn' : 'http://ditu.zjzwfw.gov.cn'
const _serverUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.1.210' : 'http://192.168.1.210'
// const _divisionUrl = process.env.NODE_ENV === 'production' ? 'http://ditu.zj.cn//services/divisionsearch?v=2' : 'http://ditu.zj.cn//services/divisionsearch?v=2'
const _divisionUrl = 'https://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/'
const _user = '/user'
const _message = '/message'
const _catalog = '/catalog'
const _upload = '/upload'
const _layer = '/layers'
const baseUrl = rootUrl + '/imagepro'

export default {
  Pagination: {
    size: 20
  },
  ApiUrl: ApiUrl,
  root1: rootUrl1,
  baseUrl: baseUrl1,
  samplePreview: samplePreview,
  sampleDetail: sampleDetail,
  sampleSets: sampleSets,
  root: rootUrl,
  divisionUrl: _divisionUrl,
  socket: _socket,
  geocode: _geocode,
  mapBase: _mapUrl,
  serverUrl: _serverUrl,
  auth: {
    login: rootUrl + '/common/login',
    register: rootUrl + '/register',
    signOut: rootUrl + '/signOut',
    getUserInfo: rootUrl + '/info/users'
  },
  search: {
    index: baseUrl + '/searchIndex',
    list: baseUrl + '/listTbbizDom',
    get: baseUrl + '/getThumbnail',
    getInfo: baseUrl + '/getTbbizDom',
    bound: baseUrl + '/boundTbbizDom',
    place: baseUrl + '/placeTbbizDom',
    menu: baseUrl + '/fListTbbizDom'
  },
  condition: {
    frozen: baseUrl + '/system/frozen',
    list: baseUrl + '/system/listqc',
    remove: baseUrl + '/system/remove',
    save: baseUrl + '/system/save'
  },
  folder: {
    getData: baseUrl + _user + '/getData',
    getTree: baseUrl + _user + '/getTree',
    saveData: baseUrl + _user + '/saveData',
    updateData: baseUrl + _user + '/updateData',
    saveFolder: baseUrl + _user + '/saveFolder',
    // POST /api/user/batchRemoveData
    removeData: baseUrl + _user + '/batchRemoveData',
    removeFolder: baseUrl + _user + '/removeFolder',
    // GET /api/user/batchRemoveData
    batchRemove: baseUrl + _user + '/batchRemoveData',
    // POST /api/user/batchSaveData
    batchSaveData: baseUrl + _user + '/batchSaveData',
    // POST /api/user/batchUpdateData
    batchUpdate: baseUrl + _user + '/batchUpdateData'
  },
  publishImage: baseUrl + '/publishImage',
  getImage: baseUrl + '/get',
  // POST /api/batchPublish
  batchPush: baseUrl + '/batchPublish',
  // POST /api/batchCancelP
  cancelBatchPush: baseUrl + '/batchCancelP',
  // POST /api/imageCutting
  imageCutting: baseUrl + '/imageCutting',
  // POST /api/resampleGeotiff
  resampleGeotiff: baseUrl + '/resampleGeotiff',
  // POST /api/services/download
  download: baseUrl + '/services/download',
  // POST /api/services/batchdownload
  batchDownload: baseUrl + '/services/batchDownload',
  // GET /api/indexInfo
  indexInfo: baseUrl + '/indexInfo',
  // GET /api/indexBounds
  indexBounds: baseUrl + '/indexBounds',
  // /api/images/delete
  imageRemove: baseUrl + '/images/delete',
  message: {
    // GET /api/message/listmessage
    list: baseUrl + _message + '/listmessage',
    // GET /api/message/get
    get: baseUrl + _message + '/get',
    // GET /api/message/remove
    remove: baseUrl + _message + '/remove',
    // GET /api/message/remove
    save: baseUrl + _message + '/save',
    // GET /api/message/batchRemove
    batchRemove: baseUrl + _message + '/batchRemove'
  },
  catalog: {
    // GET /api/catalog/batchRemove
    batchRemove: baseUrl + _catalog + '/batchRemove',
    // GET /api/catalog/get
    get: baseUrl + _catalog + '/get',
    // GET /api/catalog/init
    init: baseUrl + _catalog + '/init',
    // GET /api/catalog/listcatalog
    listcatalog: baseUrl + _catalog + '/listcatalog',
    // GET /api/catalog/remove
    remove: baseUrl + _catalog + '/remove',
    // POST /api/catalog/save
    save: baseUrl + _catalog + '/save',
    // POST /api/catalog/save
    update: baseUrl + _catalog + '/update',
    getConf: baseUrl + _catalog + '/getConf'
  },
  upload: {
    // GET /api/getR
    getInfo: baseUrl + _upload + '/getR',
    list: baseUrl + _upload + '/listB',
    detail: baseUrl + _upload + '/listR'
  },
  layer: {
    // GET /api/layers/batchRemoveRelate
    batchRemoveRelate: baseUrl + _layer + '/batchRemoveRelate',
    // GET /api/layers/batchRemove
    batchRemove: baseUrl + _layer + '/batchRemove',
    get: baseUrl + _layer + '/get',
    // GET /api/layers/layerlist
    layerlist: baseUrl + _layer + '/layerlist',
    // post /api/layers/insertRelate
    update: baseUrl + _layer + '/insertRelate',
    list: baseUrl + _layer + '/list',
    // GET /api/layers/outputXml/{name}
    outputXml: baseUrl + _layer + '/outputXml',
    remove: baseUrl + _layer + '/remove',
    save: baseUrl + _layer + '/save'
  },
  analysisImages: baseUrl + '/analysisImages'
}
