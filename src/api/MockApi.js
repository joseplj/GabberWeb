import ApiInterface from './ApiInterface'
import { make, makeList, CURRENT_USER_ID, hasher } from './generator'
import { store } from '../store'

const MOCK = {
  SPEED: 300,
  LOGGED_IN: true,
  newProjId: 10,
  commentId: 100
}

const isEmail = /.+@.+\..+/

export default class MockApi extends ApiInterface {
  /*
   * Mock Utils
   */
  async mockConnection () {
    await new Promise(resolve => setTimeout(resolve, MOCK.SPEED))
  }
  async mock (payload = null, success = true) {
    await this.mockConnection()
    return this.makeEnvelope(success, payload)
  }
  
  /*
   * Auth Endpoints
   */
  async getSelf () {
    return MOCK.LOGGED_IN
      ? this.mock(make.user(CURRENT_USER_ID))
      : this.mock(null, false)
  }
  async register (fullname, email, password) {
    return isEmail.test(email)
      ? this.mock(make.user(CURRENT_USER_ID))
      : this.mock(null, false)
  }
  async login (email, password) {
    return isEmail.test(email)
      ? this.mock(make.user(CURRENT_USER_ID))
      : this.mock(null, false)
  }
  async logout () {
    return this.mock()
  }
  async sendReset (email) {
    return this.mock(true)
  }
  async resetPassword (token, password) {
    return token !== 'fail'
      ? this.mock(make.user(CURRENT_USER_ID))
      : this.mock(null, false)
  }
  
  /*
   * Projects Management
   */
  async listAllProjects () {
    return this.mock({
      personal: store.getters.currentUser
        ? makeList(2, make.project, 'private') : [],
      public: makeList({ from: 3, to: 8 }, make.project)
    })
  }
  async getProject (id) {
    return id < 100
      ? this.mock(make.project(id, id % 2 ? 'public' : 'private'))
      : this.mock(null, false)
  }
  async joinProject (id) {
    let project = make.project(id)
    project.members.push(make.membership(CURRENT_USER_ID, 'user'))
    return this.mock(project)
  }
  async createProject (title, description, tags, privacy) {
    let id = MOCK.newProjId++
    return this.editProject(id, title, description, tags, privacy)
  }
  async editProject (id, title, description, tags, privacy) {
    if (title === 'fail') return this.mock(null, false)
    
    return this.mock(Object.assign(
      make.project(id, privacy),
      {
        title,
        description,
        creator: make.user(CURRENT_USER_ID),
        isProjectPublic: privacy === 'public'
      }
    ))
  }
  async deleteProject (id) {
    return this.mock(null)
  }
  
  /*
   * Projects Relations
   */
  async getProjectTags (projectId) {
    return this.mock(
      makeList(7, make.tag)
    )
  }
  
  /*
   * Sessions
   */
  async getProjectSessions (projectId) {
    // -> Session[]
    return this.mock(
      makeList(7, make.session, projectId, CURRENT_USER_ID)
    )
  }
  async getSession (sessionId, projectId) {
    let id = hasher.decode(sessionId)[0]
    return id
      ? this.mock(make.session(id, projectId, CURRENT_USER_ID))
      : this.mock(null, false)
  }
  async getSessionAnnotations (sessionId, projectId) {
    return this.mock(
      makeList(5, make.detailedAnnotation, sessionId)
    )
  }
  async getChildComments (projectId, sessionId, annotationId, commentId) {
    const from = MOCK.commentId
    const pageSize = { from, to: from + 5 }
    MOCK.commentId += 5
    return this.mock(
      makeList(pageSize, make.comment, annotationId, commentId)
    )
  }
  async createComment (projectId, sessionId, annotationId, content, parentId = null) {
    if (content === 'fail') return this.mock(null, false)
    return this.mock({
      ...make.comment(
        MOCK.commentId++,
        annotationId,
        parentId || null,
        CURRENT_USER_ID
      ),
      content
    })
  }
  async deleteComment (projectId, sessionId, annotationId, commentId) {
    return this.mock(null)
  }
}
