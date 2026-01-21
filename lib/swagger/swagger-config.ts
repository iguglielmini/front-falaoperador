import { OpenAPIV3 } from "openapi-types";

export const swaggerConfig: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "API de Usuários - Fala Operador",
    version: "1.0.0",
    description: "API para gerenciamento de usuários com autenticação e perfis",
    contact: {
      name: "Suporte",
      email: "suporte@falaoperador.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de Desenvolvimento",
    },
    {
      url: "https://api.falaoperador.com",
      description: "Servidor de Produção",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "Endpoints para gerenciamento de usuários",
    },
    {
      name: "Tarefas",
      description: "Endpoints para gerenciamento de tarefas",
    },
    {
      name: "Eventos",
      description: "Endpoints para gerenciamento de eventos",
    },
    {
      name: "Patrocinadores",
      description: "Endpoints para gerenciamento de patrocinadores",
    },
  ],
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Listar todos os usuários",
        description:
          "Retorna uma lista de todos os usuários cadastrados (sem senha)",
        responses: {
          "200": {
            description: "Lista de usuários retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Criar novo usuário",
        description: "Cria um novo usuário no sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUserInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/User",
                    },
                    message: {
                      type: "string",
                      example: "Usuário criado com sucesso",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro de validação ou email já cadastrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Buscar usuário por ID",
        description: "Retorna os dados de um usuário específico",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do usuário (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Usuário encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Atualizar usuário",
        description: "Atualiza os dados de um usuário existente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do usuário (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateUserInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/User",
                    },
                    message: {
                      type: "string",
                      example: "Usuário atualizado com sucesso",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro de validação ou email já cadastrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Deletar usuário",
        description: "Remove um usuário do sistema",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do usuário (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Usuário deletado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                        },
                      },
                    },
                    message: {
                      type: "string",
                      example: "Usuário deletado com sucesso",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/tarefas": {
      get: {
        tags: ["Tarefas"],
        summary: "Listar tarefas",
        description:
          "Retorna lista de tarefas (suas tarefas + tarefas públicas). Admin vê todas.",
        responses: {
          "200": {
            description: "Lista de tarefas retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Tarefa",
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tarefas"],
        summary: "Criar nova tarefa",
        description: "Cria uma nova tarefa associada ao usuário autenticado",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTarefaInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Tarefa criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Tarefa",
                    },
                    message: {
                      type: "string",
                      example: "Tarefa criada com sucesso",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/tarefas/{id}": {
      get: {
        tags: ["Tarefas"],
        summary: "Buscar tarefa por ID",
        description:
          "Retorna os dados de uma tarefa específica (apenas dono, admin ou se pública)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID da tarefa (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Tarefa encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Tarefa",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão para visualizar esta tarefa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Tarefa não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Tarefas"],
        summary: "Atualizar tarefa",
        description: "Atualiza uma tarefa existente (apenas dono ou admin)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID da tarefa (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTarefaInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Tarefa atualizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Tarefa",
                    },
                    message: {
                      type: "string",
                      example: "Tarefa atualizada com sucesso",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão para editar esta tarefa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Tarefa não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Tarefas"],
        summary: "Excluir tarefa",
        description: "Remove uma tarefa do sistema (apenas dono ou admin)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID da tarefa (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Tarefa excluída com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      nullable: true,
                    },
                    message: {
                      type: "string",
                      example: "Tarefa excluída com sucesso",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão para excluir esta tarefa",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Tarefa não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/eventos": {
      get: {
        tags: ["Eventos"],
        summary: "Listar eventos",
        description:
          "Retorna lista de eventos (públicos + eventos que participa). Admin vê todos.",
        responses: {
          "200": {
            description: "Lista de eventos retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Evento",
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Eventos"],
        summary: "Criar novo evento",
        description:
          "Cria um novo evento com upload de imagem e geolocalização automática",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/CreateEventoInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Evento criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Evento",
                    },
                    message: {
                      type: "string",
                      example: "Evento criado com sucesso",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/eventos/{id}": {
      get: {
        tags: ["Eventos"],
        summary: "Buscar evento por ID",
        description:
          "Retorna os dados de um evento específico (apenas criador, participantes, admin ou se público)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do evento (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Evento encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Evento",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão para visualizar este evento",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Eventos"],
        summary: "Atualizar evento",
        description: "Atualiza um evento existente (apenas criador ou admin)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do evento (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UpdateEventoInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Evento atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Evento",
                    },
                    message: {
                      type: "string",
                      example: "Evento atualizado com sucesso",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão para editar este evento",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Eventos"],
        summary: "Excluir evento",
        description: "Remove um evento do sistema (apenas criador ou admin)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do evento (UUID)",
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Evento excluído com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      nullable: true,
                    },
                    message: {
                      type: "string",
                      example: "Evento excluído com sucesso",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão para excluir este evento",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Evento não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/patrocinadores": {
      get: {
        tags: ["Patrocinadores"],
        summary: "Listar patrocinadores",
        description:
          "Retorna lista de todos os patrocinadores (acesso público)",
        responses: {
          "200": {
            description: "Lista de patrocinadores retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Patrocinador",
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro interno do servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Patrocinadores"],
        summary: "Criar patrocinador",
        description: "Criar novo patrocinador (requer autenticação de ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["nomeEmpresa", "imagem"],
                properties: {
                  nomeEmpresa: {
                    type: "string",
                    description: "Nome da empresa",
                    example: "Empresa XYZ",
                  },
                  links: {
                    type: "string",
                    description: "JSON array de URLs",
                    example:
                      '["https://empresa.com","https://instagram.com/empresa"]',
                  },
                  telefone: {
                    type: "string",
                    description: "Telefone de contato",
                    example: "(11) 99999-9999",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email de contato",
                    example: "contato@empresa.com",
                  },
                  endereco: {
                    type: "string",
                    description: "Endereço da empresa",
                    example: "Rua Exemplo, 123 - São Paulo/SP",
                  },
                  imagem: {
                    type: "string",
                    format: "binary",
                    description:
                      "Logo da empresa (jpg, jpeg, png, webp - max 5MB)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Patrocinador criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      $ref: "#/components/schemas/Patrocinador",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/patrocinadores/{id}": {
      get: {
        tags: ["Patrocinadores"],
        summary: "Buscar patrocinador por ID",
        description:
          "Retorna dados de um patrocinador específico (acesso público)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "ID do patrocinador",
          },
        ],
        responses: {
          "200": {
            description: "Patrocinador encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      $ref: "#/components/schemas/Patrocinador",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Patrocinador não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Patrocinadores"],
        summary: "Atualizar patrocinador",
        description:
          "Atualiza dados de um patrocinador (requer autenticação de ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "ID do patrocinador",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  nomeEmpresa: {
                    type: "string",
                    description: "Nome da empresa",
                  },
                  links: {
                    type: "string",
                    description: "JSON array de URLs",
                  },
                  telefone: {
                    type: "string",
                    description: "Telefone de contato",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email de contato",
                  },
                  endereco: {
                    type: "string",
                    description: "Endereço da empresa",
                  },
                  imagem: {
                    type: "string",
                    format: "binary",
                    description: "Nova logo da empresa (opcional)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Patrocinador atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      $ref: "#/components/schemas/Patrocinador",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Patrocinador não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Patrocinadores"],
        summary: "Deletar patrocinador",
        description: "Remove um patrocinador (requer autenticação de ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "ID do patrocinador",
          },
        ],
        responses: {
          "200": {
            description: "Patrocinador deletado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "Patrocinador deletado com sucesso",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "403": {
            description: "Sem permissão",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Patrocinador não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "ID único do usuário",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          nome: {
            type: "string",
            description: "Nome do usuário",
            example: "João",
          },
          sobrenome: {
            type: "string",
            description: "Sobrenome do usuário",
            example: "Silva",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
            example: "joao.silva@example.com",
          },
          telefone: {
            type: "string",
            description: "Telefone do usuário",
            example: "(11) 99999-9999",
          },
          dataNascimento: {
            type: "string",
            format: "date-time",
            description: "Data de nascimento",
            example: "1990-01-15T00:00:00.000Z",
          },
          perfil: {
            type: "string",
            enum: ["ADMIN", "USUARIO"],
            description: "Perfil do usuário",
            example: "USUARIO",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação",
            example: "2024-01-14T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data de última atualização",
            example: "2024-01-14T10:30:00.000Z",
          },
        },
      },
      CreateUserInput: {
        type: "object",
        required: [
          "nome",
          "sobrenome",
          "email",
          "password",
          "telefone",
          "dataNascimento",
        ],
        properties: {
          nome: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            description: "Nome do usuário",
            example: "João",
          },
          sobrenome: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            description: "Sobrenome do usuário",
            example: "Silva",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
            example: "joao.silva@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            maxLength: 100,
            description: "Senha do usuário",
            example: "senha123",
          },
          telefone: {
            type: "string",
            minLength: 10,
            description: "Telefone do usuário",
            example: "(11) 99999-9999",
          },
          dataNascimento: {
            type: "string",
            format: "date",
            description: "Data de nascimento (YYYY-MM-DD)",
            example: "1990-01-15",
          },
          perfil: {
            type: "string",
            enum: ["ADMIN", "USUARIO"],
            description: "Perfil do usuário (opcional, padrão: USUARIO)",
            example: "USUARIO",
          },
        },
      },
      UpdateUserInput: {
        type: "object",
        properties: {
          nome: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            description: "Nome do usuário",
            example: "João",
          },
          sobrenome: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            description: "Sobrenome do usuário",
            example: "Santos",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
            example: "joao.santos@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            maxLength: 100,
            description: "Nova senha do usuário",
            example: "novaSenha123",
          },
          telefone: {
            type: "string",
            minLength: 10,
            description: "Telefone do usuário",
            example: "(11) 98888-8888",
          },
          dataNascimento: {
            type: "string",
            format: "date",
            description: "Data de nascimento (YYYY-MM-DD)",
            example: "1990-01-15",
          },
          perfil: {
            type: "string",
            enum: ["ADMIN", "USUARIO"],
            description: "Perfil do usuário",
            example: "ADMIN",
          },
        },
      },
      Tarefa: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "ID único da tarefa",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          titulo: {
            type: "string",
            description: "Título da tarefa",
            example: "Implementar nova feature",
          },
          descricao: {
            type: "string",
            nullable: true,
            description: "Descrição detalhada da tarefa",
            example: "Implementar sistema de notificações em tempo real",
          },
          status: {
            type: "string",
            enum: ["PENDENTE", "EM_PROGRESSO", "CONCLUIDA", "CANCELADA"],
            description: "Status atual da tarefa",
            example: "PENDENTE",
          },
          prioridade: {
            type: "string",
            enum: ["BAIXA", "MEDIA", "ALTA", "URGENTE"],
            description: "Prioridade da tarefa",
            example: "ALTA",
          },
          publica: {
            type: "boolean",
            description: "Se a tarefa é visível para todos",
            example: false,
          },
          dataInicio: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Data de início planejada",
            example: "2026-01-20T00:00:00.000Z",
          },
          dataFim: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Data de término planejada",
            example: "2026-01-31T00:00:00.000Z",
          },
          userId: {
            type: "string",
            format: "uuid",
            description: "ID do usuário criador",
          },
          user: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              nome: { type: "string" },
              sobrenome: { type: "string" },
              email: { type: "string", format: "email" },
            },
            description: "Dados do usuário criador",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data da última atualização",
          },
        },
      },
      CreateTarefaInput: {
        type: "object",
        required: ["titulo"],
        properties: {
          titulo: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            description: "Título da tarefa",
            example: "Implementar nova feature",
          },
          descricao: {
            type: "string",
            maxLength: 500,
            description: "Descrição detalhada da tarefa",
            example: "Implementar sistema de notificações em tempo real",
          },
          status: {
            type: "string",
            enum: ["PENDENTE", "EM_PROGRESSO", "CONCLUIDA", "CANCELADA"],
            default: "PENDENTE",
            description: "Status inicial da tarefa",
          },
          prioridade: {
            type: "string",
            enum: ["BAIXA", "MEDIA", "ALTA", "URGENTE"],
            default: "MEDIA",
            description: "Prioridade da tarefa",
          },
          publica: {
            type: "boolean",
            default: false,
            description: "Se a tarefa será visível para todos",
          },
          dataInicio: {
            type: "string",
            format: "date",
            description: "Data de início (YYYY-MM-DD)",
            example: "2026-01-20",
          },
          dataFim: {
            type: "string",
            format: "date",
            description: "Data de término (YYYY-MM-DD)",
            example: "2026-01-31",
          },
        },
      },
      UpdateTarefaInput: {
        type: "object",
        properties: {
          titulo: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            description: "Título da tarefa",
          },
          descricao: {
            type: "string",
            maxLength: 500,
            description: "Descrição detalhada da tarefa",
          },
          status: {
            type: "string",
            enum: ["PENDENTE", "EM_PROGRESSO", "CONCLUIDA", "CANCELADA"],
            description: "Status da tarefa",
          },
          prioridade: {
            type: "string",
            enum: ["BAIXA", "MEDIA", "ALTA", "URGENTE"],
            description: "Prioridade da tarefa",
          },
          publica: {
            type: "boolean",
            description: "Se a tarefa é visível para todos",
          },
          dataInicio: {
            type: "string",
            format: "date",
            description: "Data de início (YYYY-MM-DD)",
          },
          dataFim: {
            type: "string",
            format: "date",
            description: "Data de término (YYYY-MM-DD)",
          },
        },
      },
      Evento: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "ID único do evento",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          titulo: {
            type: "string",
            description: "Título do evento",
            example: "Podcast: Tecnologia e Inovação",
          },
          descricao: {
            type: "string",
            nullable: true,
            description: "Descrição detalhada do evento",
            example: "Discussão sobre as últimas tendências em tecnologia",
          },
          imagem: {
            type: "string",
            nullable: true,
            description: "Caminho da imagem do evento",
            example: "/uploads/eventos/evento_123.jpg",
          },
          endereco: {
            type: "string",
            description: "Endereço do evento",
            example: "Av. Paulista",
          },
          numero: {
            type: "string",
            description: "Número do endereço",
            example: "1000",
          },
          cep: {
            type: "string",
            description: "CEP do local",
            example: "01310-100",
          },
          latitude: {
            type: "number",
            format: "float",
            nullable: true,
            description: "Latitude da localização",
            example: -23.561684,
          },
          longitude: {
            type: "number",
            format: "float",
            nullable: true,
            description: "Longitude da localização",
            example: -46.655981,
          },
          dataInicio: {
            type: "string",
            format: "date-time",
            description: "Data e hora de início",
            example: "2026-02-01T19:00:00.000Z",
          },
          dataFim: {
            type: "string",
            format: "date-time",
            description: "Data e hora de término",
            example: "2026-02-01T22:00:00.000Z",
          },
          criadorId: {
            type: "string",
            format: "uuid",
            description: "ID do criador do evento",
          },
          criador: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              nome: { type: "string" },
              sobrenome: { type: "string" },
              email: { type: "string", format: "email" },
            },
            description: "Dados do criador",
          },
          visibilidade: {
            type: "string",
            enum: ["PUBLICA", "PRIVADA"],
            description: "Visibilidade do evento",
            example: "PUBLICA",
          },
          categoria: {
            type: "string",
            enum: ["PODCAST", "EVENTO", "ENTREVISTA", "LIVE", "OUTRO"],
            description: "Categoria do evento",
            example: "PODCAST",
          },
          linkYoutube: {
            type: "string",
            nullable: true,
            description: "Link do YouTube relacionado",
            example: "https://youtube.com/watch?v=abc123",
          },
          participantes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                eventoId: { type: "string", format: "uuid" },
                userId: { type: "string", format: "uuid" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    nome: { type: "string" },
                    sobrenome: { type: "string" },
                    email: { type: "string", format: "email" },
                  },
                },
                createdAt: { type: "string", format: "date-time" },
              },
            },
            description: "Lista de participantes",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data da última atualização",
          },
        },
      },
      CreateEventoInput: {
        type: "object",
        required: [
          "titulo",
          "endereco",
          "numero",
          "cep",
          "dataInicio",
          "dataFim",
        ],
        properties: {
          titulo: {
            type: "string",
            minLength: 3,
            maxLength: 200,
            description: "Título do evento",
            example: "Podcast: Tecnologia e Inovação",
          },
          descricao: {
            type: "string",
            maxLength: 1000,
            description: "Descrição detalhada do evento",
            example: "Discussão sobre as últimas tendências em tecnologia",
          },
          imagem: {
            type: "string",
            format: "binary",
            description: "Arquivo de imagem (JPEG, PNG, WebP - máx 5MB)",
          },
          endereco: {
            type: "string",
            description: "Endereço do evento",
            example: "Av. Paulista",
          },
          numero: {
            type: "string",
            description: "Número do endereço",
            example: "1000",
          },
          cep: {
            type: "string",
            pattern: "^[0-9]{5}-?[0-9]{3}$",
            description: "CEP do local (com ou sem hífen)",
            example: "01310-100",
          },
          dataInicio: {
            type: "string",
            format: "date-time",
            description: "Data e hora de início (ISO 8601)",
            example: "2026-02-01T19:00:00Z",
          },
          dataFim: {
            type: "string",
            format: "date-time",
            description: "Data e hora de término (ISO 8601)",
            example: "2026-02-01T22:00:00Z",
          },
          visibilidade: {
            type: "string",
            enum: ["PUBLICA", "PRIVADA"],
            default: "PUBLICA",
            description: "Visibilidade do evento",
          },
          categoria: {
            type: "string",
            enum: ["PODCAST", "EVENTO", "ENTREVISTA", "LIVE", "OUTRO"],
            default: "EVENTO",
            description: "Categoria do evento",
          },
          linkYoutube: {
            type: "string",
            format: "uri",
            description: "Link do YouTube",
            example: "https://youtube.com/watch?v=abc123",
          },
          participantes: {
            type: "string",
            description: "Array JSON de IDs de usuários participantes",
            example: '["uuid1", "uuid2"]',
          },
        },
      },
      UpdateEventoInput: {
        type: "object",
        properties: {
          titulo: {
            type: "string",
            minLength: 3,
            maxLength: 200,
            description: "Título do evento",
          },
          descricao: {
            type: "string",
            maxLength: 1000,
            description: "Descrição detalhada",
          },
          imagem: {
            type: "string",
            format: "binary",
            description: "Nova imagem (JPEG, PNG, WebP - máx 5MB)",
          },
          endereco: {
            type: "string",
            description: "Endereço do evento",
          },
          numero: {
            type: "string",
            description: "Número do endereço",
          },
          cep: {
            type: "string",
            pattern: "^[0-9]{5}-?[0-9]{3}$",
            description: "CEP do local",
          },
          dataInicio: {
            type: "string",
            format: "date-time",
            description: "Data e hora de início",
          },
          dataFim: {
            type: "string",
            format: "date-time",
            description: "Data e hora de término",
          },
          visibilidade: {
            type: "string",
            enum: ["PUBLICA", "PRIVADA"],
            description: "Visibilidade do evento",
          },
          categoria: {
            type: "string",
            enum: ["PODCAST", "EVENTO", "ENTREVISTA", "LIVE", "OUTRO"],
            description: "Categoria do evento",
          },
          linkYoutube: {
            type: "string",
            format: "uri",
            description: "Link do YouTube",
          },
          participantes: {
            type: "string",
            description: "Array JSON de IDs de participantes",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Mensagem de erro",
            example: "Erro ao processar requisição",
          },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Mensagem de erro",
            example: "Erro de validação",
          },
          details: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: {
                type: "string",
              },
            },
            description: "Detalhes dos erros de validação por campo",
            example: {
              email: ["Email inválido"],
              password: ["Senha deve ter no mínimo 6 caracteres"],
            },
          },
        },
      },
      Patrocinador: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único do patrocinador',
          },
          nomeEmpresa: {
            type: 'string',
            description: 'Nome da empresa patrocinadora',
            example: 'Empresa XYZ',
          },
          links: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uri',
            },
            description: 'Links da empresa (site, redes sociais, etc)',
            example: ['https://empresa.com', 'https://instagram.com/empresa'],
          },
          telefone: {
            type: 'string',
            nullable: true,
            description: 'Telefone de contato',
            example: '(11) 99999-9999',
          },
          email: {
            type: 'string',
            format: 'email',
            nullable: true,
            description: 'Email de contato',
            example: 'contato@empresa.com',
          },
          endereco: {
            type: 'string',
            nullable: true,
            description: 'Endereço da empresa',
            example: 'Rua Exemplo, 123 - São Paulo/SP',
          },
          imagem: {
            type: 'string',
            description: 'Caminho da logo da empresa',
            example: '/uploads/patrocinadores/patrocinador-123456.jpg',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização',
          },
        },
      },
    },
  },
};
