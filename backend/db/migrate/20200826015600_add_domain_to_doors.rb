class AddDomainToDoors < ActiveRecord::Migration[6.0]
  def change
    add_column :doors, :domain, :integer
  end
end
