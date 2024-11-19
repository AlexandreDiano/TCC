Rails.application.routes.draw do
  resources :schedules
  resources :keys
  resources :doors
  devise_for :users,
  path: '',
  path_names: {
  sign_in: 'login',
  sign_out: 'logout',
  registration: 'signup'
  },
  controllers: {
  sessions: 'sessions',
  registrations: 'registrations'
  }  

  post 'doors/link', to: 'doors#link'
  post 'doors/:id/openremote', to: 'doors#criar_solicitacao_abertura'

  get 'users', to: 'users#index'
  get 'users/:id', to: 'users#show'
  put 'users/:id', to: 'users#update'

  get 'v1.0/rfid/solicitaentrada', to: 'hardware#solicita_entrada'
  get 'v1.0/rfid/solicitasaida', to: 'hardware#solicita_saida'
  get 'v1.0/checar_solicitacoes', to: 'hardware#verifica_solicitacoes_abertura'

  get 'accesses', to: 'accesses#index'
  get 'accesses/:id', to: 'accesses#show'

  get 'dashinfos', to: 'dashboard#dashinfos'
  get 'lastaccess', to: 'dashboard#lastaccess'
  get 'accesshistory', to: 'dashboard#accesshistory'
  get 'lastusers', to: 'dashboard#lastusers'
  get 'accesscount', to: 'dashboard#accesscount'
  
end
