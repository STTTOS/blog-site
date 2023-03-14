export interface Ebook {
  /**
   * 电子书名称
   */
  name: string;
  /**
   * 唯一键
   */
  id: number;
  /**
   * 电子书分类
   */
  category: string;
  /**
   * 上传时间
   */
  createdAt: number;
  /**
   * 上传用户
   */
  createdBy: string;
  /**
   * 字数(字段可能为空),单位:
   */
  words: number;
  /**
   * 资源地址
   */
  eBookUrl: string;
}

export type SearchParams = Pick<Ebook, 'name' | 'category'>
export type Identity = { id: number; }
export type DeleteEbook = Identity
export type AddEbook = Omit<Ebook, 'id'>
export type UpdateEbook = AddEbook & Identity